import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../src/theme';

export default function PrivacySecurityScreen() {
  const router = useRouter();

  // Privacy settings state
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [saveChats, setSaveChats] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'You will be redirected to change your password.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => console.log('Navigate to change password') },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => console.log('Delete account'),
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'We will prepare your data and send a download link to your email within 24 hours.',
      [{ text: 'OK' }]
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
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Biometric Authentication</Text>
              <Text style={styles.settingDescription}>
                Use Face ID or fingerprint to unlock
              </Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={biometricEnabled ? colors.primary : colors.gray[400]}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingDescription}>
                Update your account password
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.light}
            />
          </TouchableOpacity>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Save Chat History</Text>
              <Text style={styles.settingDescription}>
                Store your AI conversations for future reference
              </Text>
            </View>
            <Switch
              value={saveChats}
              onValueChange={setSaveChats}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={saveChats ? colors.primary : colors.gray[400]}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Analytics</Text>
              <Text style={styles.settingDescription}>
                Help improve the app with anonymous usage data
              </Text>
            </View>
            <Switch
              value={analyticsEnabled}
              onValueChange={setAnalyticsEnabled}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={analyticsEnabled ? colors.primary : colors.gray[400]}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Export My Data</Text>
              <Text style={styles.settingDescription}>
                Download all your data in JSON format
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.light}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, styles.dangerText]}>
                Delete Account
              </Text>
              <Text style={styles.settingDescription}>
                Permanently delete your account and data
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.error}
            />
          </TouchableOpacity>
        </View>

        {/* Legal Documents */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                Read our privacy policy
              </Text>
            </View>
            <Ionicons
              name="open-outline"
              size={20}
              color={colors.text.light}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingDescription}>
                Read our terms and conditions
              </Text>
            </View>
            <Ionicons
              name="open-outline"
              size={20}
              color={colors.text.light}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Data Protection</Text>
              <Text style={styles.settingDescription}>
                Learn how we protect your data
              </Text>
            </View>
            <Ionicons
              name="open-outline"
              size={20}
              color={colors.text.light}
            />
          </TouchableOpacity>
        </View>

        {/* Info Boxes */}
        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={20} color={colors.success} />
          <Text style={styles.infoText}>
            Your data is encrypted end-to-end. We never share your personal information with third parties.
          </Text>
        </View>

        <View style={[styles.infoBox, styles.warningBox]}>
          <Ionicons name="alert-circle" size={20} color={colors.warning} />
          <Text style={[styles.infoText, styles.warningText]}>
            Deleting your account is permanent and cannot be undone. Make sure to export your data first if needed.
          </Text>
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
  section: {
    backgroundColor: colors.white,
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  dangerText: {
    color: colors.error,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.success + '10',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    gap: 12,
  },
  warningBox: {
    backgroundColor: colors.warning + '10',
  },
  infoText: {
    ...typography.body2,
    color: colors.success,
    flex: 1,
  },
  warningText: {
    color: colors.warning,
  },
});
