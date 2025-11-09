/**
 * Nigerian Tax Reform Acts RAG Service
 * Connects to Python FastAPI backend for 2025-2026 tax reform knowledge
 */

const TAX_RAG_API_URL = process.env.EXPO_PUBLIC_TAX_RAG_API_URL || 'http://localhost:8000';

export interface TaxChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TaxChatResponse {
  answer: string;
  sources: Array<{
    document: string;
    section: string;
    title: string;
    pages: string;
    type: string;
  }>;
  retrieved_chunks: number;
  timestamp: string;
  has_rag_context: boolean;
  metadata?: {
    model?: string;
    tokens_used?: any;
    query_type?: string;
  };
}

export interface TaxSearchResult {
  text: string;
  document: string;
  section: string;
  title: string;
  page: string;
  relevance_score: number;
}

export interface TaxRAGStats {
  status: string;
  total_chunks?: number;
  embedding_model?: string;
  embedding_dimension?: number;
  last_updated?: string;
  timezone?: string;
}

class TaxRAGService {
  private baseURL: string;
  private healthCheckCache: {
    isHealthy: boolean;
    lastCheck: number;
  } = {
    isHealthy: false,
    lastCheck: 0,
  };
  private readonly CACHE_DURATION = 60000; // 1 minute

  constructor() {
    this.baseURL = TAX_RAG_API_URL;
  }

  /**
   * Check if Tax RAG service is available (with caching)
   */
  async checkHealth(): Promise<boolean> {
    const now = Date.now();

    // Return cached result if still valid
    if (now - this.healthCheckCache.lastCheck < this.CACHE_DURATION) {
      return this.healthCheckCache.isHealthy;
    }

    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.healthCheckCache = { isHealthy: false, lastCheck: now };
        return false;
      }

      const data = await response.json();
      const isHealthy = data.rag_initialized === true;

      this.healthCheckCache = { isHealthy, lastCheck: now };
      return isHealthy;
    } catch (error) {
      console.error('[TaxRAG] Health check failed:', error);
      this.healthCheckCache = { isHealthy: false, lastCheck: now };
      return false;
    }
  }

  /**
   * Send a chat message and get Tax RAG-powered response
   */
  async chat(
    message: string,
    conversationHistory?: TaxChatMessage[],
    userId?: string
  ): Promise<TaxChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_history: conversationHistory || [],
          user_id: userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get response');
      }

      const data: TaxChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('[TaxRAG] Chat error:', error);
      throw error;
    }
  }

  /**
   * Search for relevant tax documents
   */
  async search(query: string, topK: number = 5): Promise<TaxSearchResult[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/search?query=${encodeURIComponent(query)}&top_k=${topK}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('[TaxRAG] Search error:', error);
      throw error;
    }
  }

  /**
   * Get Tax RAG system statistics
   */
  async getStats(): Promise<TaxRAGStats> {
    try {
      const response = await fetch(`${this.baseURL}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get stats');
      }

      const data: TaxRAGStats = await response.json();
      return data;
    } catch (error) {
      console.error('[TaxRAG] Stats error:', error);
      throw error;
    }
  }

  /**
   * Format sources for display
   */
  formatSources(sources: TaxChatResponse['sources']): string {
    if (!sources || sources.length === 0) {
      return '';
    }

    return sources
      .map((source, index) => {
        const parts = [];
        if (source.document) parts.push(source.document);
        if (source.section) parts.push(`Section ${source.section}`);
        if (source.title) parts.push(`(${source.title})`);
        if (source.pages) parts.push(`Pages ${source.pages}`);

        return `${index + 1}. ${parts.join(' - ')}`;
      })
      .join('\n');
  }

  /**
   * Check if a query is tax-related (client-side check)
   */
  isTaxRelatedQuery(message: string): boolean {
    const taxKeywords = [
      'tax', 'vat', 'firs', 'revenue', 'income', 'corporation',
      'paye', 'withholding', 'capital gains', 'dividend',
      'deduction', 'exemption', 'relief', 'assessment',
      'digital asset', 'cryptocurrency', 'nft', 'blockchain',
      'freelancer', 'company', 'individual', 'taxable',
      'commencement', '2025', '2026', 'reform', 'act',
      'nigeria revenue service', 'nrs', 'duty', 'levy', 'naira'
    ];

    const messageLower = message.toLowerCase();
    return taxKeywords.some(keyword => messageLower.includes(keyword));
  }
}

// Export singleton instance
export const taxRAGService = new TaxRAGService();

// Export class for testing
export { TaxRAGService };

// Export default
export default taxRAGService;
