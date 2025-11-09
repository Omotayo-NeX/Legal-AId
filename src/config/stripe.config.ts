/**
 * Stripe Configuration
 *
 * IMPORTANT: Before using in production:
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your publishable key from https://dashboard.stripe.com/apikeys
 * 3. Add STRIPE_PUBLISHABLE_KEY to your .env file
 * 4. Set up Apple Pay merchant ID in Apple Developer Console
 * 5. Link merchant ID in Stripe Dashboard
 */

export const STRIPE_CONFIG = {
  // Test publishable key (replace with your own from Stripe Dashboard)
  publishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE',

  // Merchant details for Apple Pay
  merchantIdentifier: 'merchant.com.legalaid.app',
  merchantDisplayName: 'Legal AI.d',

  // Countries where Apple Pay is supported
  merchantCountryCode: 'NG', // Nigeria

  // Currency
  currency: 'NGN', // Nigerian Naira

  // Google Pay (for Android)
  googlePay: {
    testEnv: __DEV__,
    merchantName: 'Legal AI.d',
    merchantCountryCode: 'NG',
  },
};

// Stripe API endpoint (you'll need to create this on your backend)
export const STRIPE_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
