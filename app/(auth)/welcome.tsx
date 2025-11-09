import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/Button';
import { colors, typography } from '../../src/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* App Logo / Illustration */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>⚖️</Text>
          <Text style={styles.appName}>Legal AI.d</Text>
        </View>

        {/* Value Propositions */}
        <View style={styles.features}>
          <FeatureItem
            emoji="💬"
            title="AI Legal Assistant"
            description="Get instant answers to legal questions in plain English or Pidgin"
          />
          <FeatureItem
            emoji="🧮"
            title="Tax Calculator"
            description="Calculate your PAYE and business taxes with Nigerian tax laws"
          />
          <FeatureItem
            emoji="📄"
            title="Document Generator"
            description="Create legal documents like NDAs, tenancy agreements, and more"
          />
          <FeatureItem
            emoji="🔔"
            title="Compliance Reminders"
            description="Never miss tax deadlines or CAC renewal dates"
          />
        </View>
      </View>

      {/* CTA Buttons */}
      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/(auth)/signup')}
          variant="primary"
          size="large"
          style={styles.primaryButton}
        />
        <Button
          title="I Already Have an Account"
          onPress={() => router.push('/(auth)/login')}
          variant="outline"
          size="large"
        />
      </View>
    </View>
  );
}

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ emoji, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  appName: {
    ...typography.h1,
    color: colors.secondary,
    fontSize: 42,
  },
  features: {
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 4,
  },
  featureDescription: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  footer: {
    padding: 24,
    gap: 12,
  },
  primaryButton: {
    marginBottom: 4,
  },
});
