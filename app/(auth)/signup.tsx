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
import { colors, typography } from '../../src/theme';

export default function SignupScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { data, error } = await AuthService.signUpWithEmail(
      email,
      password,
      fullName
    );
    setLoading(false);

    if (error) {
      Alert.alert('Signup Failed', error);
      return;
    }

    Alert.alert(
      'Success!',
      'Your account has been created. Please check your email to verify your account.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/(auth)/login'),
        },
      ]
    );
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join Legal AI.d and get access to AI-powered legal assistance
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setErrors({ ...errors, fullName: undefined });
            }}
            leftIcon="person-outline"
            error={errors.fullName}
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.password}
          />

          <Input
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrors({ ...errors, confirmPassword: undefined });
            }}
            secureTextEntry
            leftIcon="lock-closed-outline"
            error={errors.confirmPassword}
          />

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            size="large"
            style={styles.signupButton}
          />

          <Text style={styles.terms}>
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Button
            title="Sign In"
            onPress={() => router.push('/(auth)/login')}
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
    ...typography.body2,
    color: colors.text.secondary,
  },
  form: {
    marginBottom: 24,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  terms: {
    ...typography.caption,
    color: colors.text.light,
    textAlign: 'center',
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
