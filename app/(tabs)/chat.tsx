import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import { useAuthStore } from '../../src/store/authStore';
import { colors, typography, theme } from '../../src/theme';
import { Message } from '../../src/types';
import { AIService } from '../../src/services/ai.service';
import { taxRAGService } from '../../src/services/tax-rag.service';

export default function ChatScreen() {
  const { user } = useAuthStore();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: AIService.isAvailable()
        ? 'Hello! I\'m your AI legal assistant with access to the Nigerian Compliance Knowledge Base and the **2025-2026 Tax Reform Acts**. Ask me anything about CAC registration, FIRS tax, the new 2026 tax law, NDPA, PenCom, and more. I can help you in English or Pidgin!'
        : 'Hello! I\'m your AI legal assistant. Please note: AI features require an OpenAI API key to be configured.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [taxRAGAvailable, setTaxRAGAvailable] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    // Check if AI service is available
    if (!AIService.isAvailable()) {
      Alert.alert(
        'AI Not Available',
        'OpenAI API key is not configured. Please add your API key to use AI features.'
      );
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    try {
      let aiResponse: string;
      let usedRAG = false;

      // Try Tax RAG first if available and query is tax-related
      if (taxRAGAvailable && taxRAGService.isTaxRelatedQuery(messageText)) {
        try {
          console.log('[Chat] Using Tax RAG for query:', messageText);
          const taxResponse = await taxRAGService.chat(messageText);

          // Only use RAG response if it has context
          if (taxResponse.has_rag_context) {
            // Use answer without sources
            aiResponse = taxResponse.answer;
            usedRAG = true;
            console.log('[Chat] Tax RAG response received');
          }
        } catch (taxError: any) {
          console.warn('[Chat] Tax RAG failed, falling back to regular AI:', taxError.message);
          // Fall through to regular AI
        }
      }

      // Fallback to regular AI service if RAG not used
      if (!usedRAG) {
        console.log('[Chat] Using regular AI service');
        const conversationHistory = AIService.formatConversationHistory(
          messages.slice(1) // Exclude initial greeting
        );
        aiResponse = await AIService.sendMessage(messageText, conversationHistory);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse!,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${error.message || 'Failed to get response'}. Please try again.`,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom when new message is added
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  useEffect(() => {
    // Check Tax RAG availability
    const checkTaxRAG = async () => {
      try {
        const isHealthy = await taxRAGService.checkHealth();
        setTaxRAGAvailable(isHealthy);
        if (isHealthy) {
          console.log('[Chat] ✅ Tax RAG Service is available');
        } else {
          console.log('[Chat] ⚠️ Tax RAG Service is not available');
        }
      } catch (error) {
        console.error('[Chat] Failed to check Tax RAG health:', error);
        setTaxRAGAvailable(false);
      }
    };

    // Load suggested questions
    const loadSuggestions = async () => {
      try {
        const questions = await AIService.getSuggestedQuestions();
        setSuggestedQuestions(questions);
      } catch (error) {
        console.error('Failed to load suggested questions:', error);
      }
    };

    checkTaxRAG();
    loadSuggestions();
  }, []);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          {isUser ? (
            <Text style={styles.userMessageText}>{item.content}</Text>
          ) : (
            <Markdown
              style={{
                body: {
                  color: colors.text.primary,
                  ...typography.body1,
                },
                heading1: {
                  ...typography.h3,
                  color: colors.text.primary,
                  marginTop: 8,
                  marginBottom: 8,
                },
                heading2: {
                  ...typography.h4,
                  color: colors.text.primary,
                  marginTop: 8,
                  marginBottom: 4,
                },
                strong: {
                  fontWeight: '700',
                  color: colors.text.primary,
                },
                em: {
                  fontStyle: 'italic',
                },
                bullet_list: {
                  marginVertical: 4,
                },
                ordered_list: {
                  marginVertical: 4,
                },
                list_item: {
                  marginVertical: 2,
                },
                code_inline: {
                  backgroundColor: colors.surface,
                  paddingHorizontal: 4,
                  paddingVertical: 2,
                  borderRadius: 4,
                  fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                },
                fence: {
                  backgroundColor: colors.surface,
                  padding: 8,
                  borderRadius: 8,
                  marginVertical: 4,
                },
                link: {
                  color: colors.primary,
                  textDecorationLine: 'underline',
                },
              }}
            >
              {item.content}
            </Markdown>
          )}
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.aiTimestamp,
            ]}
          >
            {new Date(item.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Tax RAG Status Indicator */}
      {taxRAGAvailable && (
        <View style={styles.ragIndicator}>
          <Ionicons name="checkmark-circle" size={16} color={colors.white} />
          <Text style={styles.ragIndicatorText}>
            ✨ 2026 Tax Reform Knowledge Active
          </Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        ListHeaderComponent={
          messages.length === 1 && suggestedQuestions.length > 0 ? (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Compliance Topics:</Text>
              {suggestedQuestions.slice(0, 4).map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionChip}
                  onPress={() => setInputText(question)}
                >
                  <Text style={styles.suggestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null
        }
      />

      {isLoading && (
        <View style={styles.typingIndicator}>
          <View style={styles.typingDot} />
          <View style={[styles.typingDot, { animationDelay: '0.2s' }]} />
          <View style={[styles.typingDot, { animationDelay: '0.4s' }]} />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask me anything about Nigerian law..."
          placeholderTextColor={colors.text.light}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Ionicons
            name="send"
            size={20}
            color={colors.white}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 110 : 100,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  userBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 4,
    ...theme.shadows.sm,
  },
  messageText: {
    ...typography.body1,
    marginBottom: 4,
  },
  userMessageText: {
    color: colors.white,
  },
  aiMessageText: {
    color: colors.text.primary,
  },
  timestamp: {
    ...typography.caption,
    fontSize: 10,
  },
  userTimestamp: {
    color: colors.white,
    opacity: 0.8,
    textAlign: 'right',
  },
  aiTimestamp: {
    color: colors.text.light,
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionsTitle: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 12,
    fontWeight: '600',
  },
  suggestionChip: {
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionText: {
    ...typography.body2,
    color: colors.primary,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.light,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  input: {
    flex: 1,
    ...typography.body1,
    color: colors.text.primary,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  ragIndicator: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  ragIndicatorText: {
    color: colors.white,
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
});
