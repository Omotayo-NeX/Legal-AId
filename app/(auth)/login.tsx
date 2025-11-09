import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { AuthService } from '../../src/services/auth.service';
import { useAuthStore } from '../../src/store/authStore';
import { colors, typography } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { data, error } = await AuthService.signInWithEmail(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error);
      return;
    }

    if (data?.user) {
      const user = await AuthService.getCurrentUser();
      setUser(user);
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="your@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: undefined });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
            error={errors.email}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            size="large"
            style={styles.loginButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Button
            title="Sign Up"
            onPress={() => router.push('/(auth)/signup')}
            variant="outline"
            size="medium"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    ...typography.h1,
    color: colors.secondary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  form: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 12,
  },
  footer: {
    alignItems: 'center',
    gap: 12,
  },
  footerText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
});
