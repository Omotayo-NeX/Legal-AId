import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';
import { RemindersService, Reminder } from '../src/services/reminders.service';

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setIsLoading(true);
      await RemindersService.updateOverdueReminders();
      const data = await RemindersService.getReminders();
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
      Alert.alert('Error', 'Failed to load reminders');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadReminders();
    setIsRefreshing(false);
  };

  const handleCompleteReminder = async (id: string) => {
    try {
      await RemindersService.completeReminder(id);
      await loadReminders();
      Alert.alert('Success', 'Reminder marked as completed');
    } catch (error) {
      console.error('Error completing reminder:', error);
      Alert.alert('Error', 'Failed to complete reminder');
    }
  };

  const handleDeleteReminder = async (id: string) => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await RemindersService.deleteReminder(id);
              await loadReminders();
              Alert.alert('Success', 'Reminder deleted');
            } catch (error) {
              console.error('Error deleting reminder:', error);
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tax':
        return 'calculator';
      case 'cac':
        return 'business';
      case 'pension':
        return 'card';
      default:
        return 'notifications';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tax':
        return '#F77F00';
      case 'cac':
        return '#0077B6';
      case 'pension':
        return '#06D6A0';
      default:
        return colors.primary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#06D6A0';
      case 'overdue':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  const filteredReminders = reminders.filter((reminder) =>
    activeTab === 'pending'
      ? reminder.status === 'pending' || reminder.status === 'overdue'
      : reminder.status === 'completed'
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reminders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading reminders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <TouchableOpacity
          onPress={() => router.push('/create-reminder')}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}
          >
            Active
          </Text>
          {reminders.filter((r) => r.status === 'pending' || r.status === 'overdue')
            .length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {
                  reminders.filter((r) => r.status === 'pending' || r.status === 'overdue')
                    .length
                }
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {filteredReminders.length > 0 ? (
          filteredReminders.map((reminder) => (
            <View
              key={reminder.id}
              style={[
                styles.reminderCard,
                reminder.status === 'overdue' && styles.overdueCard,
              ]}
            >
              <View style={styles.reminderHeader}>
                <View style={styles.reminderLeft}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: getTypeColor(reminder.type) + '20' },
                    ]}
                  >
                    <Ionicons
                      name={getTypeIcon(reminder.type) as any}
                      size={24}
                      color={getTypeColor(reminder.type)}
                    />
                  </View>
                  <View style={styles.reminderInfo}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    {reminder.description && (
                      <Text style={styles.reminderDescription}>
                        {reminder.description}
                      </Text>
                    )}
                    <View style={styles.reminderMeta}>
                      <Ionicons name="calendar" size={14} color={colors.text.secondary} />
                      <Text style={styles.reminderDate}>
                        {formatDate(reminder.due_date)}
                      </Text>
                      {reminder.recurring && (
                        <>
                          <Ionicons
                            name="repeat"
                            size={14}
                            color={colors.text.secondary}
                            style={{ marginLeft: 12 }}
                          />
                          <Text style={styles.reminderFrequency}>
                            {reminder.frequency}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(reminder.status) + '20' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(reminder.status) },
                    ]}
                  >
                    {reminder.status}
                  </Text>
                </View>
              </View>

              {activeTab === 'pending' && (
                <View style={styles.reminderActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCompleteReminder(reminder.id)}
                  >
                    <Ionicons name="checkmark-circle" size={18} color="#06D6A0" />
                    <Text style={[styles.actionText, { color: '#06D6A0' }]}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteReminder(reminder.id)}
                  >
                    <Ionicons name="trash" size={18} color={colors.error} />
                    <Text style={[styles.actionText, { color: colors.error }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                activeTab === 'pending' ? 'notifications-outline' : 'checkmark-done'
              }
              size={64}
              color={colors.text.light}
            />
            <Text style={styles.emptyTitle}>
              {activeTab === 'pending' ? 'No Active Reminders' : 'No Completed Reminders'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'pending'
                ? 'Create a reminder to keep track of important deadlines'
                : 'Completed reminders will appear here'}
            </Text>
            {activeTab === 'pending' && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/create-reminder')}
              >
                <Ionicons name="add-circle" size={20} color={colors.white} />
                <Text style={styles.createButtonText}>Create Reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontSize: 22,
    flex: 1,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body1,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.caption,
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  reminderCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...colors.shadows?.md,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reminderLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  reminderDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  reminderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reminderDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  reminderFrequency: {
    ...typography.caption,
    color: colors.text.secondary,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    backgroundColor: colors.background,
  },
  actionText: {
    ...typography.body2,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    ...typography.body2,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    ...typography.body1,
    color: colors.white,
    fontWeight: '600',
  },
});
