import { Stack } from 'expo-router';
import { colors } from '../../src/theme';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTintColor: colors.secondary,
        headerBackTitle: 'Back',
      }}
    >
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Sign In',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          title: 'Create Account',
        }}
      />
    </Stack>
  );
}
