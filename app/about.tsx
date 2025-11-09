import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';

export default function AboutScreen() {
  const router = useRouter();

  const features = [
    {
      icon: 'chatbubbles',
      title: 'AI Legal Assistant',
      description: 'Get instant answers about Nigerian law, compliance, and tax matters. Our AI is trained on the latest 2025-2026 Tax Reform Acts.',
    },
    {
      icon: 'document-text',
      title: 'Document Generation',
      description: 'Create professional legal documents, contracts, and compliance forms with customizable templates.',
    },
    {
      icon: 'notifications',
      title: 'Compliance Reminders',
      description: 'Never miss important deadlines for tax filing, CAC renewals, annual returns, and more.',
    },
    {
      icon: 'shield-checkmark',
      title: 'Know Your Rights',
      description: 'Access a comprehensive library of Nigerian legal information, including labor laws, consumer rights, and business regulations.',
    },
    {
      icon: 'calculator',
      title: 'Tax Calculator',
      description: 'Calculate personal income tax, corporate tax, VAT, and other Nigerian taxes accurately using the latest rates.',
    },
    {
      icon: 'search',
      title: 'Legal Knowledge Base',
      description: 'Search through CAC, FIRS, NDPA, PenCom regulations and the 2026 tax law reforms.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Ask Questions',
      description: 'Type any question about Nigerian law, tax, or compliance in the chat. The AI understands both English and Pidgin.',
    },
    {
      step: '2',
      title: 'Get Accurate Answers',
      description: 'Receive detailed, sourced answers powered by our RAG system that accesses official legal documents including the 2025-2026 Tax Reform Acts.',
    },
    {
      step: '3',
      title: 'Generate Documents',
      description: 'Create legal documents using our templates. Customize them to your needs and download as PDF.',
    },
    {
      step: '4',
      title: 'Stay Compliant',
      description: 'Set reminders for important deadlines and receive notifications to keep your business compliant.',
    },
  ];

  const coverage = [
    { icon: 'business', text: 'CAC Registration & Compliance' },
    { icon: 'cash', text: 'FIRS Tax Regulations' },
    { icon: 'shield', text: 'NDPA Data Protection' },
    { icon: 'wallet', text: 'PenCom Pension Requirements' },
    { icon: 'document', text: '2026 Tax Reform Acts' },
    { icon: 'people', text: 'Labor & Employment Law' },
    { icon: 'ribbon', text: 'Consumer Rights' },
    { icon: 'stats-chart', text: 'Business Regulations' },
  ];

  const socialLinks = [
    {
      icon: 'logo-twitter',
      name: 'Twitter',
      onPress: () => Linking.openURL('https://twitter.com/legalaid'),
    },
    {
      icon: 'logo-linkedin',
      name: 'LinkedIn',
      onPress: () => Linking.openURL('https://linkedin.com/company/legalaid'),
    },
    {
      icon: 'logo-instagram',
      name: 'Instagram',
      onPress: () => Linking.openURL('https://instagram.com/legalaid'),
    },
    {
      icon: 'logo-facebook',
      name: 'Facebook',
      onPress: () => Linking.openURL('https://facebook.com/legalaid'),
    },
  ];

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
        <Text style={styles.headerTitle}>About Legal AI.d</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>⚖️</Text>
          </View>
          <Text style={styles.appName}>Legal AI.d</Text>
          <Text style={styles.tagline}>
            Your AI-Powered Nigerian Legal Assistant
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Mission */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <View style={styles.missionCard}>
            <Text style={styles.missionText}>
              Legal AI.d democratizes access to legal information in Nigeria. We combine artificial intelligence with the latest legal regulations to help individuals and businesses stay compliant, understand their rights, and navigate complex legal requirements with confidence.
            </Text>
          </View>
        </View>

        {/* What is Legal AI.d */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is Legal AI.d?</Text>
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionText}>
              Legal AI.d is Nigeria's first AI-powered legal compliance assistant. We provide instant access to up-to-date legal information, including the groundbreaking 2025-2026 Tax Reform Acts, through an intelligent chat interface.
            </Text>
            <Text style={[styles.descriptionText, styles.spacedText]}>
              Our platform uses advanced Retrieval-Augmented Generation (RAG) technology to ensure every answer is accurate, sourced, and current. Whether you're a business owner, freelancer, or individual seeking legal clarity, Legal AI.d is your trusted companion.
            </Text>
          </View>
        </View>

        {/* Key Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name={feature.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          {howItWorks.map((item, index) => (
            <View key={index} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{item.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{item.title}</Text>
                <Text style={styles.stepDescription}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Coverage Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Cover</Text>
          <View style={styles.coverageGrid}>
            {coverage.map((item, index) => (
              <View key={index} style={styles.coverageItem}>
                <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                <Text style={styles.coverageText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Technology */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Powered By</Text>
          <View style={styles.techCard}>
            <View style={styles.techItem}>
              <Ionicons name="hardware-chip" size={24} color={colors.primary} />
              <Text style={styles.techText}>OpenAI GPT-4</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="search" size={24} color={colors.primary} />
              <Text style={styles.techText}>RAG Technology</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
              <Text style={styles.techText}>End-to-End Encryption</Text>
            </View>
            <View style={styles.techItem}>
              <Ionicons name="cloud" size={24} color={colors.primary} />
              <Text style={styles.techText}>Supabase Backend</Text>
            </View>
          </View>
        </View>

        {/* Special Feature: Tax RAG */}
        <View style={styles.highlightSection}>
          <View style={styles.highlightBadge}>
            <Ionicons name="star" size={16} color={colors.white} />
            <Text style={styles.highlightBadgeText}>NEW</Text>
          </View>
          <Text style={styles.highlightTitle}>2026 Tax Reform Knowledge</Text>
          <Text style={styles.highlightDescription}>
            Legal AI.d is the first app with built-in access to the Nigerian Tax Reform Acts 2025-2026. Get accurate, real-time answers about the new tax law without outdated information.
          </Text>
          <View style={styles.highlightFeatures}>
            <View style={styles.highlightFeature}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.highlightFeatureText}>Instant tax law answers</Text>
            </View>
            <View style={styles.highlightFeature}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.highlightFeatureText}>Official source citations</Text>
            </View>
            <View style={styles.highlightFeature}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.highlightFeatureText}>Always up-to-date</Text>
            </View>
          </View>
        </View>

        {/* Who We Serve */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who We Serve</Text>
          <View style={styles.audienceCard}>
            <Text style={styles.audienceTitle}>🏢 Business Owners</Text>
            <Text style={styles.audienceText}>
              Stay compliant with CAC, FIRS, and other regulatory bodies. Generate contracts and track compliance deadlines.
            </Text>
          </View>
          <View style={styles.audienceCard}>
            <Text style={styles.audienceTitle}>💼 Freelancers & Consultants</Text>
            <Text style={styles.audienceText}>
              Understand your tax obligations, VAT requirements, and create client contracts easily.
            </Text>
          </View>
          <View style={styles.audienceCard}>
            <Text style={styles.audienceTitle}>👥 Individuals</Text>
            <Text style={styles.audienceText}>
              Know your rights, understand employment law, consumer protection, and personal tax requirements.
            </Text>
          </View>
          <View style={styles.audienceCard}>
            <Text style={styles.audienceTitle}>📚 Students & Researchers</Text>
            <Text style={styles.audienceText}>
              Access accurate Nigerian legal information for academic research and learning.
            </Text>
          </View>
        </View>

        {/* Connect With Us */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialContainer}>
            {socialLinks.map((link, index) => (
              <TouchableOpacity
                key={index}
                style={styles.socialButton}
                onPress={link.onPress}
              >
                <Ionicons name={link.icon as any} size={32} color={colors.primary} />
                <Text style={styles.socialName}>{link.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Legal AI.d</Text>
          <Text style={styles.footerText}>
            Making Nigerian law accessible to everyone
          </Text>
          <Text style={styles.copyright}>
            © 2025 Legal AI.d. All rights reserved.
          </Text>
          <TouchableOpacity
            style={styles.websiteButton}
            onPress={() => Linking.openURL('https://www.legalaid.ng')}
          >
            <Text style={styles.websiteButtonText}>Visit our website</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
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
  heroSection: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: 8,
  },
  tagline: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  version: {
    ...typography.caption,
    color: colors.text.light,
  },
  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  missionCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  missionText: {
    ...typography.body1,
    color: colors.text.primary,
    lineHeight: 24,
  },
  descriptionCard: {
    paddingHorizontal: 20,
  },
  descriptionText: {
    ...typography.body1,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  spacedText: {
    marginTop: 16,
  },
  featureCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  stepCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    ...typography.h3,
    color: colors.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  coverageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  coverageItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  coverageText: {
    ...typography.caption,
    color: colors.text.primary,
    flex: 1,
  },
  techCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  techItem: {
    width: '50%',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  techText: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 4,
    textAlign: 'center',
  },
  highlightSection: {
    backgroundColor: colors.primary,
    marginTop: 16,
    padding: 24,
  },
  highlightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.white + '30',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 12,
  },
  highlightBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  highlightTitle: {
    ...typography.h2,
    color: colors.white,
    marginBottom: 12,
  },
  highlightDescription: {
    ...typography.body1,
    color: colors.white,
    lineHeight: 24,
    marginBottom: 16,
  },
  highlightFeatures: {
    gap: 8,
  },
  highlightFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightFeatureText: {
    ...typography.body1,
    color: colors.white,
  },
  audienceCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  audienceTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  audienceText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  socialButton: {
    alignItems: 'center',
    padding: 8,
  },
  socialName: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    marginTop: 16,
  },
  footerTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 8,
  },
  footerText: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  copyright: {
    ...typography.caption,
    color: colors.text.light,
    marginBottom: 16,
  },
  websiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  websiteButtonText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
  },
});
