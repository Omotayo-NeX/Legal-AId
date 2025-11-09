import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';
import { RemindersService, CreateReminderInput } from '../src/services/reminders.service';

export default function CreateReminderScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'tax' | 'cac' | 'pension' | 'custom'>('tax');
  const [dueDate, setDueDate] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reminderTypes = [
    { id: 'tax', label: 'Tax', icon: 'calculator', color: '#F77F00' },
    { id: 'cac', label: 'CAC', icon: 'business', color: '#0077B6' },
    { id: 'pension', label: 'Pension', icon: 'card', color: '#06D6A0' },
    { id: 'custom', label: 'Custom', icon: 'notifications', color: colors.primary },
  ];

  const frequencies = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'annually', label: 'Annually' },
  ];

  const validateForm = (): boolean => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a title');
      return false;
    }

    if (!dueDate.trim()) {
      Alert.alert('Validation Error', 'Please enter a due date');
      return false;
    }

    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      Alert.alert('Validation Error', 'Please enter date in YYYY-MM-DD format');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const reminderData: CreateReminderInput = {
        title,
        description: description || undefined,
        type,
        due_date: new Date(dueDate).toISOString(),
        recurring,
        frequency: recurring ? frequency : undefined,
      };

      await RemindersService.createReminder(reminderData);

      Alert.alert('Success', 'Reminder created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error('Error creating reminder:', error);
      Alert.alert('Error', 'Failed to create reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Reminder</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., PAYE Tax Filing"
            placeholderTextColor={colors.text.light}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add details about this reminder"
            placeholderTextColor={colors.text.light}
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Type */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Type <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.typeGrid}>
            {reminderTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.typeCard,
                  type === item.id && styles.typeCardActive,
                  type === item.id && { borderColor: item.color },
                ]}
                onPress={() => setType(item.id as any)}
              >
                <View
                  style={[
                    styles.typeIcon,
                    { backgroundColor: item.color + '20' },
                  ]}
                >
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <Text
                  style={[
                    styles.typeLabel,
                    type === item.id && { color: item.color },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Due Date <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (e.g., 2026-02-15)"
            placeholderTextColor={colors.text.light}
            value={dueDate}
            onChangeText={setDueDate}
          />
          <Text style={styles.hint}>
            Enter date in YYYY-MM-DD format
          </Text>
        </View>

        {/* Recurring */}
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setRecurring(!recurring)}
          >
            <View
              style={[
                styles.checkbox,
                recurring && styles.checkboxActive,
              ]}
            >
              {recurring && (
                <Ionicons name="checkmark" size={18} color={colors.white} />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Recurring Reminder</Text>
          </TouchableOpacity>
        </View>

        {/* Frequency (only if recurring) */}
        {recurring && (
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {frequencies.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.frequencyButton,
                    frequency === item.id && styles.frequencyButtonActive,
                  ]}
                  onPress={() => setFrequency(item.id as any)}
                >
                  <Text
                    style={[
                      styles.frequencyText,
                      frequency === item.id && styles.frequencyTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoText}>
              You'll receive notifications for upcoming reminders. Recurring reminders will
              automatically create new instances based on the frequency you select.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Ionicons name="checkmark-circle" size={20} color={colors.white} />
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Creating...' : 'Create Reminder'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: colors.secondary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontSize: 22,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...typography.body1,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeCardActive: {
    borderWidth: 2,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    ...typography.body2,
    color: colors.text.primary,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxLabel: {
    ...typography.body1,
    color: colors.text.primary,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  frequencyText: {
    ...typography.body2,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  frequencyTextActive: {
    color: colors.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...colors.shadows?.md,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 16,
  },
});
