import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/store/authStore';
import { colors, typography } from '../src/theme';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    console.log('Save button pressed');

    // Validate
    if (!formData.full_name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsSaving(true);

    try {
      console.log('Saving profile data:', formData);

      // Update the local store
      if (user) {
        const updatedUser = {
          ...user,
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
        };
        setUser(updatedUser);
        console.log('User updated successfully:', updatedUser);
      }

      // Show success alert and navigate back
      setTimeout(() => {
        Alert.alert(
          'Success',
          'Your profile has been updated successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('Navigating back');
                router.back();
              },
            },
          ]
        );
      }, 300);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleCancel}
          style={styles.backButton}
        >
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          style={styles.saveButton}
        >
          <Text style={[styles.saveButtonText, isSaving && styles.saveButtonTextDisabled]}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {formData.full_name.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <TouchableOpacity style={styles.changePhotoButton}>
            <Ionicons name="camera" size={20} color={colors.primary} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={colors.text.light}
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor={colors.text.light}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <Text style={styles.helperText}>
              Email changes require verification
            </Text>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={colors.text.secondary} />
              <TextInput
                style={styles.input}
                placeholder="+234 800 000 0000"
                placeholderTextColor={colors.text.light}
                value={formData.phone_number}
                onChangeText={(text) => setFormData({ ...formData, phone_number: text })}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Account Info */}
        <View style={styles.accountInfoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="diamond-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Subscription Plan</Text>
              <Text style={styles.infoValue}>
                {user?.subscription_tier?.toUpperCase() || 'FREE'} PLAN
              </Text>
            </View>
            {user?.subscription_tier === 'free' && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => router.push('/subscription')}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="key-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue}>
                {user?.id.slice(0, 8)}...
              </Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => console.log('Delete account'),
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
            <Text style={styles.dangerButtonText}>Delete Account</Text>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveButtonText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: colors.text.light,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    ...typography.h1,
    fontSize: 40,
    color: colors.white,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  changePhotoText: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  input: {
    ...typography.body1,
    color: colors.text.primary,
    flex: 1,
  },
  helperText: {
    ...typography.caption,
    color: colors.text.light,
    marginTop: 4,
    marginLeft: 4,
  },
  accountInfoSection: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  infoValue: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upgradeButtonText: {
    ...typography.caption,
    color: colors.white,
    fontWeight: '700',
  },
  dangerSection: {
    backgroundColor: colors.white,
    padding: 20,
    marginBottom: 32,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerButtonText: {
    ...typography.body1,
    color: colors.error,
    fontWeight: '600',
  },
});
