import OpenAI from 'openai';
import Constants from 'expo-constants';
import { RAGService, RetrievalResult } from './rag.service';

// Get API key from expo-constants (which reads from .env)
const OPENAI_API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ||
                       process.env.EXPO_PUBLIC_OPENAI_API_KEY;

console.log('OpenAI API Key loaded:', OPENAI_API_KEY ? 'YES (key present)' : 'NO (missing)');

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. AI features will not work.');
}

const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Required for React Native/Expo
    })
  : null;

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class AIService {
  private static systemPrompt = `You are a knowledgeable AI legal assistant specializing in Nigerian law. Your role is to:

1. Provide accurate information about Nigerian laws, regulations, and legal procedures
2. Help users understand their legal rights and obligations under Nigerian law
3. Assist with tax calculations (PAYE, business tax, etc.)
4. Guide users on legal document preparation
5. Explain legal concepts in simple terms
6. Support both English and Nigerian Pidgin

Important guidelines:
- Always clarify that you provide general legal information, not legal advice
- Recommend consulting a qualified lawyer for specific legal matters
- Be accurate and cite specific Nigerian laws when applicable
- Be helpful, professional, and culturally sensitive
- If you're unsure, admit it and suggest consulting a legal professional
- Focus on Nigerian law (federal and state levels)

Areas of expertise:
- Employment law (Labour Act, minimum wage, wrongful termination)
- Tenancy law (landlord-tenant rights, eviction procedures)
- Consumer protection (FCCPA 2018)
- Family law (marriage, divorce, child custody)
- Tax law (new 2025 reforms, PAYE, CIT, VAT)
- Business registration (CAC procedures)
- Traffic law and police rights
- Criminal law basics

Always be concise but thorough in your responses.`;

  /**
   * Send a chat message and get AI response with RAG enhancement
   */
  static async sendMessage(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key is not configured');
    }

    try {
      // Use RAG to retrieve relevant compliance knowledge
      const retrievalResults = await RAGService.retrieve(userMessage, {
        topK: 2,
        minScore: 0.15,
      });

      // Build enhanced system prompt with retrieved context
      let enhancedSystemPrompt = this.systemPrompt;

      if (retrievalResults.length > 0) {
        const ragContext = RAGService.formatContext(retrievalResults);
        enhancedSystemPrompt += `\n\n## Nigerian Compliance Knowledge Base Context\n\n${ragContext}\n\n**Instructions**: Use the above compliance information to provide accurate, up-to-date answers. If the user's question relates to any of the topics above, prioritize this authoritative information in your response. Always cite specific regulations and deadlines when available.`;
      }

      const messages: ChatMessage[] = [
        { role: 'system', content: enhancedSystemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ];

      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini', // Using GPT-4o Mini for cost efficiency
        messages: messages,
        temperature: 0.7,
        max_tokens: 1200,
      });

      const aiMessage = response.choices[0]?.message?.content;

      if (!aiMessage) {
        throw new Error('No response from AI');
      }

      return aiMessage;
    } catch (error: any) {
      console.error('AI Service Error:', error);

      if (error.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI configuration.');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
      }

      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  /**
   * Get suggestions for legal questions (RAG-powered)
   */
  static async getSuggestedQuestions(): Promise<string[]> {
    // Return questions from knowledge base + common queries
    const fallbackQuestions = [
      'How do I register a Business Name with CAC?',
      'What is the TIN registration process?',
      'When do I need to register for VAT?',
      'What are my PAYE employer obligations?',
      'How do freelancers pay tax in Nigeria?',
      'What is the NDPA 2023 and who does it apply to?',
      'How do I register for pension with PenCom?',
      'What is NSITF registration?',
    ];

    try {
      await RAGService.initialize();
      return fallbackQuestions;
    } catch {
      return fallbackQuestions;
    }
  }

  /**
   * Get compliance knowledge by topic
   */
  static async getComplianceKnowledge(query: string) {
    return await RAGService.retrieve(query, {
      topK: 3,
      minScore: 0.1,
    });
  }

  /**
   * Search compliance knowledge by tags
   */
  static async searchComplianceByTags(tags: string[]) {
    return await RAGService.searchByTags(tags);
  }

  /**
   * Format conversation history for API
   */
  static formatConversationHistory(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): ChatMessage[] {
    return messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));
  }

  /**
   * Check if AI service is available
   */
  static isAvailable(): boolean {
    return !!openai && !!OPENAI_API_KEY;
  }

  /**
   * Get legal advice with context
   */
  static async getLegalAdvice(
    question: string,
    context?: {
      category?: string;
      userInfo?: string;
    }
  ): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key is not configured');
    }

    let enhancedQuestion = question;

    if (context?.category) {
      enhancedQuestion = `Category: ${context.category}\n\nQuestion: ${question}`;
    }

    if (context?.userInfo) {
      enhancedQuestion += `\n\nUser context: ${context.userInfo}`;
    }

    return this.sendMessage(enhancedQuestion);
  }

  /**
   * Analyze a legal document
   */
  static async analyzeDocument(documentText: string): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key is not configured');
    }

    const prompt = `Please analyze this legal document and provide:
1. A summary of key points
2. Important clauses to note
3. Potential issues or concerns
4. Recommendations

Document:
${documentText}`;

    return this.sendMessage(prompt);
  }

  /**
   * Get tax calculation help
   */
  static async getTaxHelp(
    taxType: string,
    income: number,
    additionalInfo?: string
  ): Promise<string> {
    if (!openai) {
      throw new Error('OpenAI API key is not configured');
    }

    const prompt = `Help me understand my tax obligations in Nigeria:

Tax Type: ${taxType}
Income: ₦${income.toLocaleString()}
${additionalInfo ? `Additional Info: ${additionalInfo}` : ''}

Please provide:
1. Applicable tax rates under the 2025 tax reforms
2. How to calculate the tax
3. Important deductions and reliefs
4. Filing requirements
5. Payment deadlines`;

    return this.sendMessage(prompt);
  }
}
