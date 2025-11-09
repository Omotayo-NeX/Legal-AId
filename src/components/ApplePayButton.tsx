import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useStripe, ApplePayButton as StripeApplePayButton } from '@stripe/stripe-react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import { STRIPE_CONFIG, STRIPE_API_URL } from '../config/stripe.config';

interface ApplePayButtonProps {
  amount: number; // Amount in kobo (NGN smallest unit)
  currency?: string;
  description: string;
  onSuccess?: (paymentIntent: any) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

export function ApplePayButton({
  amount,
  currency = STRIPE_CONFIG.currency,
  description,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: ApplePayButtonProps) {
  const { presentApplePay, confirmApplePayPayment } = useStripe();
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkApplePaySupport();
  }, []);

  const checkApplePaySupport = async () => {
    if (Platform.OS !== 'ios') {
      setIsApplePaySupported(false);
      return;
    }

    try {
      // Check if Apple Pay is supported on this device
      const isSupported = await presentApplePay({
        cartItems: [
          {
            label: description,
            amount: (amount / 100).toFixed(2),
            paymentType: 'Immediate',
          },
        ],
        country: STRIPE_CONFIG.merchantCountryCode,
        currency: currency,
      }).then(() => true).catch(() => false);

      setIsApplePaySupported(isSupported);
    } catch (error) {
      console.log('Apple Pay not supported:', error);
      setIsApplePaySupported(false);
    }
  };

  const createPaymentIntent = async () => {
    try {
      const response = await fetch(`${STRIPE_API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  const handleApplePay = async () => {
    if (isProcessing || disabled) return;

    setIsProcessing(true);

    try {
      // Step 1: Create payment intent on backend
      const clientSecret = await createPaymentIntent();

      // Step 2: Present Apple Pay sheet
      const { error: presentError } = await presentApplePay({
        cartItems: [
          {
            label: description,
            amount: (amount / 100).toFixed(2),
            paymentType: 'Immediate',
          },
        ],
        country: STRIPE_CONFIG.merchantCountryCode,
        currency: currency,
        requiredShippingAddressFields: [],
        requiredBillingContactFields: ['emailAddress', 'name'],
      });

      if (presentError) {
        if (presentError.code === 'Canceled') {
          console.log('User canceled Apple Pay');
          onCancel?.();
          return;
        }
        throw new Error(presentError.message);
      }

      // Step 3: Confirm the payment
      const { error: confirmError, paymentIntent } = await confirmApplePayPayment(clientSecret);

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Step 4: Payment successful
      console.log('Payment successful:', paymentIntent);
      Alert.alert(
        'Payment Successful',
        'Your payment has been processed successfully!',
        [{ text: 'OK', onPress: () => onSuccess?.(paymentIntent) }]
      );

      onSuccess?.(paymentIntent);
    } catch (error: any) {
      console.error('Apple Pay error:', error);
      Alert.alert(
        'Payment Failed',
        error.message || 'An error occurred while processing your payment. Please try again.'
      );
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Don't render if Apple Pay is not supported
  if (!isApplePaySupported) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || isProcessing) && styles.buttonDisabled,
      ]}
      onPress={handleApplePay}
      disabled={disabled || isProcessing}
      activeOpacity={0.8}
    >
      {isProcessing ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <>
          <Ionicons name="logo-apple" size={24} color={colors.white} />
          <Text style={styles.buttonText}>Pay with Apple Pay</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

// Alternative component using Stripe's native Apple Pay button
export function NativeApplePayButton({
  amount,
  currency = STRIPE_CONFIG.currency,
  description,
  onSuccess,
  onError,
  onCancel,
  disabled = false,
}: ApplePayButtonProps) {
  const { confirmApplePayPayment } = useStripe();
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch(`${STRIPE_API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      return data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  };

  const handleApplePay = async () => {
    if (isProcessing || disabled) return;

    setIsProcessing(true);

    try {
      const clientSecret = await createPaymentIntent();

      const { error, paymentIntent } = await confirmApplePayPayment(clientSecret);

      if (error) {
        if (error.code === 'Canceled') {
          console.log('User canceled Apple Pay');
          onCancel?.();
          return;
        }
        throw new Error(error.message);
      }

      console.log('Payment successful:', paymentIntent);
      Alert.alert(
        'Payment Successful',
        'Your payment has been processed successfully!',
        [{ text: 'OK', onPress: () => onSuccess?.(paymentIntent) }]
      );

      onSuccess?.(paymentIntent);
    } catch (error: any) {
      console.error('Apple Pay error:', error);
      Alert.alert(
        'Payment Failed',
        error.message || 'An error occurred while processing your payment. Please try again.'
      );
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (Platform.OS !== 'ios') {
    return null;
  }

  return (
    <View style={styles.nativeButtonContainer}>
      <StripeApplePayButton
        onPress={handleApplePay}
        type="plain"
        buttonStyle="black"
        borderRadius={12}
        style={styles.nativeButton}
        disabled={disabled || isProcessing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.body1,
    color: colors.white,
    fontWeight: '600',
  },
  nativeButtonContainer: {
    width: '100%',
  },
  nativeButton: {
    width: '100%',
    height: 50,
  },
});
