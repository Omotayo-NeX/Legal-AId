import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const faqs: FAQItem[] = [
    {
      question: 'How do I use the AI chat assistant?',
      answer: 'Simply go to the Chat tab and type your question about Nigerian law, compliance, or tax matters. The AI will provide accurate answers based on our knowledge base and the 2025-2026 Tax Reform Acts.',
    },
    {
      question: 'What kind of questions can I ask?',
      answer: 'You can ask about CAC registration, FIRS tax compliance, NDPA data protection, PenCom pension requirements, the new 2026 tax law, and general Nigerian legal matters.',
    },
    {
      question: 'How accurate is the tax information?',
      answer: 'Our AI has access to the official 2025-2026 Nigerian Tax Reform Acts. For tax-related questions, it retrieves information directly from these documents, ensuring accuracy and currency.',
    },
    {
      question: 'Can I generate legal documents?',
      answer: 'Yes! Go to the Documents tab to generate contracts, agreements, and compliance forms. You can customize templates and download them as PDFs.',
    },
    {
      question: 'How do compliance reminders work?',
      answer: 'Set up reminders for important deadlines like tax filing, CAC renewals, or annual returns. You\'ll receive notifications before the due date.',
    },
    {
      question: 'What is the difference between Free and Premium?',
      answer: 'Free users get basic AI chat and document viewing. Premium unlocks unlimited AI queries, document generation, priority support, and advanced features.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! All data is encrypted end-to-end. We use Supabase for secure authentication and storage. We never share your personal information with third parties.',
    },
    {
      question: 'Can I use the app offline?',
      answer: 'Some features like viewing saved documents work offline. However, AI chat and document generation require an internet connection.',
    },
  ];

  const contactOptions = [
    {
      icon: 'mail-outline',
      title: 'Email Support',
      subtitle: 'support@legalaid.ng',
      onPress: () => Linking.openURL('mailto:support@legalaid.ng'),
    },
    {
      icon: 'logo-whatsapp',
      title: 'WhatsApp',
      subtitle: '+234 800 000 0000',
      onPress: () => Linking.openURL('https://wa.me/2348000000000'),
    },
    {
      icon: 'call-outline',
      title: 'Phone Support',
      subtitle: '+234 800 000 0000',
      onPress: () => Linking.openURL('tel:+2348000000000'),
    },
    {
      icon: 'globe-outline',
      title: 'Website',
      subtitle: 'www.legalaid.ng',
      onPress: () => Linking.openURL('https://www.legalaid.ng'),
    },
  ];

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Empty Feedback', 'Please enter your feedback before sending.');
      return;
    }

    Alert.alert(
      'Thank You!',
      'Your feedback has been received. We\'ll review it and get back to you if needed.',
      [{ text: 'OK', onPress: () => setFeedbackText('') }]
    );
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          {contactOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactItem}
              onPress={option.onPress}
            >
              <View style={styles.contactIcon}>
                <Ionicons name={option.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>{option.title}</Text>
                <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.light}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleFAQ(index)}
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFAQ === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Feedback Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send Feedback</Text>
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackLabel}>
              Help us improve! Share your thoughts, suggestions, or report issues.
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Type your feedback here..."
              placeholderTextColor={colors.text.light}
              multiline
              numberOfLines={6}
              value={feedbackText}
              onChangeText={setFeedbackText}
              textAlignVertical="top"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendFeedback}
            >
              <Ionicons name="send" size={18} color={colors.white} />
              <Text style={styles.sendButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="book-outline" size={20} color={colors.primary} />
            <Text style={styles.resourceText}>User Guide</Text>
            <Ionicons name="open-outline" size={18} color={colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="videocam-outline" size={20} color={colors.primary} />
            <Text style={styles.resourceText}>Video Tutorials</Text>
            <Ionicons name="open-outline" size={18} color={colors.text.light} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceItem}>
            <Ionicons name="newspaper-outline" size={20} color={colors.primary} />
            <Text style={styles.resourceText}>Blog & Updates</Text>
            <Ionicons name="open-outline" size={18} color={colors.text.light} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Legal AI.d v1.0.0</Text>
          <Text style={styles.footerSubtext}>
            Support hours: Mon-Fri, 9AM-5PM (WAT)
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  contactSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  faqItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqQuestion: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  faqAnswerText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  feedbackContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  feedbackLabel: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  feedbackInput: {
    ...typography.body1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  sendButtonText: {
    ...typography.body1,
    color: colors.white,
    fontWeight: '600',
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resourceText: {
    ...typography.body1,
    color: colors.text.primary,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.text.light,
    marginTop: 4,
  },
});
