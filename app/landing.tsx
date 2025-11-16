import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, Platform, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../src/components/Button';
import { colors, typography } from '../src/theme';

// Fallback gradient component for web compatibility
const GradientView: React.FC<{ colors?: string[]; style?: any; children: React.ReactNode }> = ({ style, children }) => (
  <View style={style}>{children}</View>
);

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <GradientView
        colors={[colors.secondary, '#0F2A3F', colors.secondary]}
        style={styles.heroSection}
      >
        <Animated.View
          style={[
            styles.heroContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>⚖️</Text>
          </View>

          <Text style={styles.heroTitle}>Legal AI.d</Text>
          <Text style={styles.heroSubtitle}>
            Your AI-Powered Legal & Tax Assistant for Nigeria
          </Text>

          <Text style={styles.heroDescription}>
            Navigate Nigerian law with confidence. Get instant legal advice, calculate taxes,
            generate documents, and stay compliant—all in one app.
          </Text>

          <View style={styles.heroCTA}>
            <Button
              title="Get Started Free"
              onPress={() => router.push('/(auth)/signup')}
              variant="primary"
              size="large"
              style={styles.primaryButton as ViewStyle}
            />
            <Button
              title="Sign In"
              onPress={() => router.push('/(auth)/login')}
              variant="outline"
              size="large"
              style={styles.secondaryButton as ViewStyle}
            />
          </View>
        </Animated.View>
      </GradientView>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Powerful Features</Text>
        <Text style={styles.sectionSubtitle}>
          Everything you need for legal clarity and compliance
        </Text>

        <View style={styles.featuresGrid}>
          <FeatureCard
            icon="💬"
            title="AI Legal Assistant"
            description="Chat in English or Pidgin. Get instant answers to Nigerian legal questions powered by advanced AI."
            gradient={['#1BAA66', '#159957']}
          />
          <FeatureCard
            icon="🧮"
            title="Tax Calculator"
            description="Calculate PAYE, VAT, and business taxes with automatic deductions based on current Nigerian tax laws."
            gradient={['#0077B6', '#0096C7']}
          />
          <FeatureCard
            icon="📄"
            title="Document Generator"
            description="Create professional legal documents—NDAs, tenancy agreements, employment contracts, and more."
            gradient={['#F77F00', '#FF9500']}
          />
          <FeatureCard
            icon="🔔"
            title="Smart Reminders"
            description="Never miss tax deadlines, CAC renewals, or compliance requirements with intelligent notifications."
            gradient={['#E63946', '#F25C66']}
          />
          <FeatureCard
            icon="📚"
            title="Know Your Rights"
            description="Access a comprehensive library of Nigerian laws, rights, and legal information at your fingertips."
            gradient={['#7209B7', '#9D4EDD']}
          />
          <FeatureCard
            icon="🔒"
            title="Secure & Private"
            description="Bank-level encryption. Your legal matters and documents remain completely confidential."
            gradient={['#264653', '#2A9D8F']}
          />
        </View>
      </View>

      {/* How It Works Section */}
      <View style={[styles.section, styles.howItWorksSection]}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>
          Get legal help in three simple steps
        </Text>

        <View style={styles.stepsContainer}>
          <StepCard
            number="1"
            title="Ask Your Question"
            description="Type your legal question in English or Pidgin. Our AI understands Nigerian context."
          />
          <StepCard
            number="2"
            title="Get Expert Answers"
            description="Receive accurate, context-aware responses backed by Nigerian law and regulations."
          />
          <StepCard
            number="3"
            title="Take Action"
            description="Generate documents, calculate taxes, or set reminders—all within the app."
          />
        </View>
      </View>

      {/* Use Cases Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perfect For</Text>

        <View style={styles.useCasesContainer}>
          <UseCaseCard
            icon="👔"
            title="Professionals"
            description="Understand your PAYE, negotiate contracts, know your employment rights"
          />
          <UseCaseCard
            icon="🏢"
            title="Business Owners"
            description="Manage CAC compliance, calculate business taxes, create legal documents"
          />
          <UseCaseCard
            icon="🏠"
            title="Landlords & Tenants"
            description="Generate tenancy agreements, understand rental laws, resolve disputes"
          />
          <UseCaseCard
            icon="💼"
            title="Freelancers"
            description="Create NDAs, calculate self-employment taxes, protect your work"
          />
        </View>
      </View>

      {/* Pricing Section */}
      <View style={[styles.section, styles.pricingSection]}>
        <Text style={styles.sectionTitle}>Simple Pricing</Text>
        <Text style={styles.sectionSubtitle}>
          Choose the plan that works for you
        </Text>

        <View style={styles.pricingCards}>
          <PricingCard
            title="Free"
            price="₦0"
            period="forever"
            features={[
              '10 AI questions per month',
              'Basic tax calculator',
              'Know your rights library',
              'Community support',
            ]}
            buttonText="Start Free"
            variant="outline"
          />
          <PricingCard
            title="Pro"
            price="₦2,500"
            period="per month"
            features={[
              'Unlimited AI questions',
              'Advanced tax calculator',
              'Unlimited document generation',
              'Smart compliance reminders',
              'Priority support',
              'Export to PDF',
            ]}
            buttonText="Get Pro"
            variant="primary"
            featured
          />
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Users Say</Text>

        <View style={styles.testimonialsContainer}>
          <TestimonialCard
            text="Legal AI.d saved me hours of research. The tax calculator is accurate and the document generator is a game-changer!"
            author="Chioma A."
            role="Small Business Owner, Lagos"
          />
          <TestimonialCard
            text="As a freelancer, I use this app to create NDAs and contracts. It's professional and saves me legal fees."
            author="Emeka O."
            role="Software Developer, Abuja"
          />
          <TestimonialCard
            text="The AI assistant explained my tenancy rights in plain English. Finally, legal help I can understand!"
            author="Fatima M."
            role="Tenant, Port Harcourt"
          />
        </View>
      </View>

      {/* Final CTA Section */}
      <GradientView
        colors={[colors.primary, '#159957']}
        style={styles.finalCTA}
      >
        <Text style={styles.finalCTATitle}>Ready to Get Started?</Text>
        <Text style={styles.finalCTAText}>
          Join thousands of Nigerians taking control of their legal matters
        </Text>
        <Button
          title="Create Free Account"
          onPress={() => router.push('/(auth)/signup')}
          variant="secondary"
          size="large"
          style={styles.finalCTAButton as ViewStyle}
        />
      </GradientView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Legal AI.d © 2025</Text>
        <Text style={styles.footerSubtext}>
          Making Nigerian law accessible to everyone
        </Text>
      </View>
    </ScrollView>
  );
}

// Feature Card Component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  gradient: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, gradient }) => (
  <View style={styles.featureCard}>
    <GradientView colors={gradient} style={styles.featureIconContainer}>
      <Text style={styles.featureIcon}>{icon}</Text>
    </GradientView>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <View style={styles.stepCard}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

// Use Case Card Component
interface UseCaseCardProps {
  icon: string;
  title: string;
  description: string;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ icon, title, description }) => (
  <View style={styles.useCaseCard}>
    <Text style={styles.useCaseIcon}>{icon}</Text>
    <Text style={styles.useCaseTitle}>{title}</Text>
    <Text style={styles.useCaseDescription}>{description}</Text>
  </View>
);

// Pricing Card Component
interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  variant: 'primary' | 'outline';
  featured?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  features,
  buttonText,
  variant,
  featured,
}) => (
  <View style={[styles.pricingCard, featured && styles.featuredPricingCard]}>
    {featured && (
      <View style={styles.featuredBadge}>
        <Text style={styles.featuredBadgeText}>MOST POPULAR</Text>
      </View>
    )}
    <Text style={styles.pricingTitle}>{title}</Text>
    <View style={styles.pricingPriceContainer}>
      <Text style={styles.pricingPrice}>{price}</Text>
      <Text style={styles.pricingPeriod}>/{period}</Text>
    </View>
    <View style={styles.pricingFeatures}>
      {features.map((feature, index) => (
        <View key={index} style={styles.pricingFeature}>
          <Text style={styles.pricingFeatureCheck}>✓</Text>
          <Text style={styles.pricingFeatureText}>{feature}</Text>
        </View>
      ))}
    </View>
    <Button
      title={buttonText}
      onPress={() => {}}
      variant={variant}
      size="large"
      style={styles.pricingButton as ViewStyle}
    />
  </View>
);

// Testimonial Card Component
interface TestimonialCardProps {
  text: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ text, author, role }) => (
  <View style={styles.testimonialCard}>
    <Text style={styles.testimonialQuote}>"</Text>
    <Text style={styles.testimonialText}>{text}</Text>
    <View style={styles.testimonialAuthor}>
      <Text style={styles.testimonialAuthorName}>{author}</Text>
      <Text style={styles.testimonialAuthorRole}>{role}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Hero Section
  heroSection: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 60,
    paddingHorizontal: 24,
    backgroundColor: colors.secondary, // Fallback for web
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoEmoji: {
    fontSize: 80,
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 48,
    color: colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.h3,
    fontSize: 24,
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  heroDescription: {
    ...typography.body1,
    fontSize: 16,
    color: colors.gray[200],
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    maxWidth: 600,
  },
  heroCTA: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    borderColor: colors.white,
  },

  // Section Styles
  section: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    ...typography.h2,
    fontSize: 36,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    ...typography.body1,
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    width: width > 768 ? '30%' : '100%',
    minWidth: 280,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: colors.primary, // Fallback for web
  },
  featureIcon: {
    fontSize: 32,
  },
  featureTitle: {
    ...typography.h4,
    fontSize: 20,
    color: colors.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    ...typography.body2,
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // How It Works Section
  howItWorksSection: {
    backgroundColor: colors.gray[50],
  },
  stepsContainer: {
    gap: 24,
  },
  stepCard: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...typography.h3,
    color: colors.white,
    fontSize: 24,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.h4,
    fontSize: 20,
    color: colors.secondary,
    marginBottom: 8,
  },
  stepDescription: {
    ...typography.body2,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },

  // Use Cases
  useCasesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  useCaseCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: width > 768 ? '22%' : '100%',
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  useCaseIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  useCaseTitle: {
    ...typography.h5,
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  useCaseDescription: {
    ...typography.body2,
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Pricing Section
  pricingSection: {
    backgroundColor: colors.gray[50],
  },
  pricingCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    justifyContent: 'center',
  },
  pricingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 32,
    width: width > 768 ? '40%' : '100%',
    minWidth: 280,
    borderWidth: 2,
    borderColor: colors.border,
  },
  featuredPricingCard: {
    borderColor: colors.primary,
    transform: [{ scale: 1.05 }],
  },
  featuredBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 16,
  },
  featuredBadgeText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
  pricingTitle: {
    ...typography.h3,
    fontSize: 28,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  pricingPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 24,
  },
  pricingPrice: {
    ...typography.h2,
    fontSize: 42,
    color: colors.primary,
  },
  pricingPeriod: {
    ...typography.body2,
    fontSize: 14,
    color: colors.text.secondary,
  },
  pricingFeatures: {
    gap: 12,
    marginBottom: 24,
  },
  pricingFeature: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  pricingFeatureCheck: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  pricingFeatureText: {
    ...typography.body2,
    fontSize: 14,
    color: colors.text.primary,
  },
  pricingButton: {
    marginTop: 8,
  },

  // Testimonials
  testimonialsContainer: {
    gap: 16,
  },
  testimonialCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  testimonialQuote: {
    fontSize: 48,
    color: colors.primary,
    lineHeight: 48,
    marginBottom: -12,
  },
  testimonialText: {
    ...typography.body1,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  testimonialAuthorName: {
    ...typography.h5,
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 4,
  },
  testimonialAuthorRole: {
    ...typography.caption,
    fontSize: 12,
    color: colors.text.secondary,
  },

  // Final CTA
  finalCTA: {
    paddingVertical: 48,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: colors.primary, // Fallback for web
  },
  finalCTATitle: {
    ...typography.h2,
    fontSize: 36,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  finalCTAText: {
    ...typography.body1,
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
  },
  finalCTAButton: {
    backgroundColor: colors.white,
    minWidth: 280,
  },

  // Footer
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: colors.secondary,
  },
  footerText: {
    ...typography.body2,
    fontSize: 14,
    color: colors.white,
    marginBottom: 4,
  },
  footerSubtext: {
    ...typography.caption,
    fontSize: 12,
    color: colors.gray[400],
  },
});
