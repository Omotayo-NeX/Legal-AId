import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useAuthStore } from '../src/store/authStore';
import { colors } from '../src/theme';
import { STRIPE_CONFIG } from '../src/config/stripe.config';

export default function RootLayout() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <StripeProvider
      publishableKey={STRIPE_CONFIG.publishableKey}
      merchantIdentifier={STRIPE_CONFIG.merchantIdentifier}
    >
      <StatusBar style="light" backgroundColor={colors.secondary} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.secondary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="document-generator" options={{ headerShown: false }} />
        <Stack.Screen name="document-preview" options={{ headerShown: false }} />
        <Stack.Screen name="document-view" options={{ headerShown: false }} />
        <Stack.Screen name="tax-calculator" options={{ headerShown: false }} />
        <Stack.Screen name="subscription" options={{ headerShown: false }} />
      </Stack>
    </StripeProvider>
  );
}
