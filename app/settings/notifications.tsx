import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, typography } from '../../src/theme';

const NOTIFICATIONS_KEY = '@notifications_preferences';

export default function NotificationsScreen() {
  const router = useRouter();

  // Notification preferences state
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [complianceReminders, setComplianceReminders] = useState(true);
  const [taxDeadlines, setTaxDeadlines] = useState(true);
  const [documentUpdates, setDocumentUpdates] = useState(false);
  const [chatMessages, setChatMessages] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Load preferences from AsyncStorage on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (saved) {
        const prefs = JSON.parse(saved);
        setPushEnabled(prefs.pushEnabled ?? true);
        setEmailEnabled(prefs.emailEnabled ?? true);
        setComplianceReminders(prefs.complianceReminders ?? true);
        setTaxDeadlines(prefs.taxDeadlines ?? true);
        setDocumentUpdates(prefs.documentUpdates ?? false);
        setChatMessages(prefs.chatMessages ?? true);
        setWeeklyDigest(prefs.weeklyDigest ?? false);
        setMarketingEmails(prefs.marketingEmails ?? false);
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  const savePreferences = async (newPrefs: any) => {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newPrefs));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      Alert.alert('Error', 'Failed to save notification preferences');
    }
  };

  const handleToggle = (key: string, value: boolean, setter: (val: boolean) => void) => {
    setter(value);
    const prefs = {
      pushEnabled,
      emailEnabled,
      complianceReminders,
      taxDeadlines,
      documentUpdates,
      chatMessages,
      weeklyDigest,
      marketingEmails,
      [key]: value,
    };
    savePreferences(prefs);
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
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Push Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Push Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Enable Push Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={(val) => handleToggle('pushEnabled', val, setPushEnabled)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={pushEnabled ? colors.primary : colors.gray[400]}
            />
          </View>
        </View>

        {/* Email Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Email Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Email Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive updates via email
              </Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={(val) => handleToggle('emailEnabled', val, setEmailEnabled)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={emailEnabled ? colors.primary : colors.gray[400]}
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Compliance Reminders</Text>
              <Text style={styles.settingDescription}>
                Tax filing deadlines, CAC renewals, etc.
              </Text>
            </View>
            <Switch
              value={complianceReminders}
              onValueChange={(val) => handleToggle('complianceReminders', val, setComplianceReminders)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={complianceReminders ? colors.primary : colors.gray[400]}
              disabled={!pushEnabled && !emailEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Tax Deadlines</Text>
              <Text style={styles.settingDescription}>
                Important tax filing and payment dates
              </Text>
            </View>
            <Switch
              value={taxDeadlines}
              onValueChange={(val) => handleToggle('taxDeadlines', val, setTaxDeadlines)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={taxDeadlines ? colors.primary : colors.gray[400]}
              disabled={!pushEnabled && !emailEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Document Updates</Text>
              <Text style={styles.settingDescription}>
                When your generated documents are ready
              </Text>
            </View>
            <Switch
              value={documentUpdates}
              onValueChange={(val) => handleToggle('documentUpdates', val, setDocumentUpdates)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={documentUpdates ? colors.primary : colors.gray[400]}
              disabled={!pushEnabled && !emailEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Chat Messages</Text>
              <Text style={styles.settingDescription}>
                AI assistant responses and updates
              </Text>
            </View>
            <Switch
              value={chatMessages}
              onValueChange={(val) => handleToggle('chatMessages', val, setChatMessages)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={chatMessages ? colors.primary : colors.gray[400]}
              disabled={!pushEnabled && !emailEnabled}
            />
          </View>
        </View>

        {/* Digest & Marketing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Updates & Marketing</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Weekly Digest</Text>
              <Text style={styles.settingDescription}>
                Summary of your compliance activities
              </Text>
            </View>
            <Switch
              value={weeklyDigest}
              onValueChange={(val) => handleToggle('weeklyDigest', val, setWeeklyDigest)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={weeklyDigest ? colors.primary : colors.gray[400]}
              disabled={!emailEnabled}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Marketing Emails</Text>
              <Text style={styles.settingDescription}>
                Product updates and special offers
              </Text>
            </View>
            <Switch
              value={marketingEmails}
              onValueChange={(val) => handleToggle('marketingEmails', val, setMarketingEmails)}
              trackColor={{ false: colors.gray[300], true: colors.primary + '40' }}
              thumbColor={marketingEmails ? colors.primary : colors.gray[400]}
              disabled={!emailEnabled}
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.info} />
          <Text style={styles.infoText}>
            Notification preferences are saved automatically. You can change them anytime.
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.info + '10',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    gap: 12,
  },
  infoText: {
    ...typography.body2,
    color: colors.info,
    flex: 1,
  },
});
