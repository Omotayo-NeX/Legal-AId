import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/store/authStore';
import { colors, typography } from '../src/theme';
import { ApplePayButton, NativeApplePayButton } from '../src/components/ApplePayButton';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number; // in kobo
  displayPrice: string;
  period: string;
  features: string[];
  recommended?: boolean;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    displayPrice: '₦0',
    period: 'forever',
    features: [
      '5 AI consultations per month',
      'Basic document templates',
      'Tax calculator access',
      'Email support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 499900, // ₦4,999 in kobo
    displayPrice: '₦4,999',
    period: 'per month',
    features: [
      'Unlimited AI consultations',
      'All document templates',
      'Priority document generation',
      'Advanced tax planning tools',
      'Priority email support',
      'Export documents to PDF',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999900, // ₦9,999 in kobo
    displayPrice: '₦9,999',
    period: 'per month',
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom document templates',
      'API access',
      'Team collaboration (up to 5 users)',
      'Compliance audit reports',
    ],
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const handlePaymentSuccess = async (paymentIntent: any) => {
    console.log('Payment successful:', paymentIntent);

    // Update user subscription tier
    if (user && selectedPlan) {
      const updatedUser = {
        ...user,
        subscription_tier: selectedPlan.id,
      };
      setUser(updatedUser);

      Alert.alert(
        'Success!',
        `You've successfully upgraded to ${selectedPlan.name} plan!`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
  };

  const handlePaymentCancel = () => {
    console.log('Payment canceled by user');
  };

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isCurrentPlan = user?.subscription_tier === plan.id;

    return (
      <View
        key={plan.id}
        style={[
          styles.planCard,
          plan.recommended && styles.planCardRecommended,
          isCurrentPlan && styles.planCardCurrent,
        ]}
      >
        {plan.recommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>RECOMMENDED</Text>
          </View>
        )}

        {isCurrentPlan && (
          <View style={styles.currentBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            <Text style={styles.currentText}>Current Plan</Text>
          </View>
        )}

        <Text style={styles.planName}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.planPrice}>{plan.displayPrice}</Text>
          <Text style={styles.planPeriod}>/{plan.period}</Text>
        </View>

        <View style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {!isCurrentPlan && plan.price > 0 && (
          <TouchableOpacity
            style={[
              styles.selectButton,
              plan.recommended && styles.selectButtonRecommended,
              selectedPlan?.id === plan.id && styles.selectButtonSelected,
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
            <Text
              style={[
                styles.selectButtonText,
                plan.recommended && styles.selectButtonTextRecommended,
                selectedPlan?.id === plan.id && styles.selectButtonTextSelected,
              ]}
            >
              {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
            </Text>
          </TouchableOpacity>
        )}

        {isCurrentPlan && (
          <View style={styles.currentPlanButton}>
            <Text style={styles.currentPlanText}>Active</Text>
          </View>
        )}
      </View>
    );
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
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Info Section */}
        <View style={styles.infoSection}>
          <Ionicons name="diamond" size={32} color={colors.primary} />
          <Text style={styles.infoTitle}>Choose Your Plan</Text>
          <Text style={styles.infoDescription}>
            Upgrade to unlock premium features and get unlimited access to Legal AI.d
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {SUBSCRIPTION_PLANS.map(renderPlanCard)}
        </View>

        {/* Apple Pay Section */}
        {selectedPlan && selectedPlan.price > 0 && (
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>Complete Your Purchase</Text>
            <Text style={styles.paymentDescription}>
              You've selected the {selectedPlan.name} plan for {selectedPlan.displayPrice}/{selectedPlan.period}
            </Text>

            {Platform.OS === 'ios' ? (
              <>
                {/* Custom styled Apple Pay button */}
                <ApplePayButton
                  amount={selectedPlan.price}
                  description={`Legal AI.d ${selectedPlan.name} Plan`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={handlePaymentCancel}
                />

                {/* Alternative: Native Apple Pay button */}
                {/* <NativeApplePayButton
                  amount={selectedPlan.price}
                  description={`Legal AI.d ${selectedPlan.name} Plan`}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onCancel={handlePaymentCancel}
                /> */}
              </>
            ) : (
              <TouchableOpacity
                style={styles.androidPayButton}
                onPress={() => Alert.alert('Coming Soon', 'Google Pay integration coming soon!')}
              >
                <Ionicons name="card" size={24} color={colors.white} />
                <Text style={styles.androidPayButtonText}>Pay with Card</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.paymentNote}>
              <Ionicons name="shield-checkmark" size={14} color={colors.text.secondary} />
              {' '}Secure payment powered by Stripe
            </Text>
          </View>
        )}

        {/* FAQ Section */}
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What payment methods do you accept?</Text>
            <Text style={styles.faqAnswer}>
              We accept Apple Pay, Google Pay, and all major credit/debit cards via Stripe.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is my payment information secure?</Text>
            <Text style={styles.faqAnswer}>
              Yes, all payments are processed securely through Stripe. We never store your payment information.
            </Text>
          </View>
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
  infoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  infoTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  infoDescription: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  plansContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  planCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  planCardRecommended: {
    borderColor: colors.primary,
  },
  planCardCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  currentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  currentText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  planName: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  planPrice: {
    ...typography.h1,
    fontSize: 36,
    color: colors.text.primary,
  },
  planPeriod: {
    ...typography.body1,
    color: colors.text.secondary,
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureText: {
    ...typography.body1,
    color: colors.text.primary,
    flex: 1,
  },
  selectButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectButtonRecommended: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectButtonSelected: {
    backgroundColor: colors.primary,
  },
  selectButtonText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '700',
  },
  selectButtonTextRecommended: {
    color: colors.white,
  },
  selectButtonTextSelected: {
    color: colors.white,
  },
  currentPlanButton: {
    backgroundColor: colors.primary + '20',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentPlanText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '700',
  },
  paymentSection: {
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    gap: 16,
  },
  paymentTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  paymentDescription: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  androidPayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  androidPayButtonText: {
    ...typography.body1,
    color: colors.white,
    fontWeight: '600',
  },
  paymentNote: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  faqSection: {
    backgroundColor: colors.white,
    marginTop: 16,
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 16,
    marginBottom: 100,
  },
  faqTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 20,
  },
  faqItem: {
    marginBottom: 20,
  },
  faqQuestion: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  faqAnswer: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
