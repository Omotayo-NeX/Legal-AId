import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useAuthStore } from '../../src/store/authStore';
import { colors, typography } from '../../src/theme';
import { RemindersService, Reminder } from '../../src/services/reminders.service';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadUpcomingReminders();
  }, []);

  const loadUpcomingReminders = async () => {
    try {
      const reminders = await RemindersService.getUpcomingReminders();
      setUpcomingReminders(reminders);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else if (diffDays <= 7) {
      return `In ${diffDays} days`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const quickActions = [
    {
      id: 'chat',
      title: 'Ask AI',
      description: 'Legal questions',
      icon: 'chatbubbles',
      color: colors.primary,
      onPress: () => router.push('/(tabs)/chat'),
    },
    {
      id: 'tax',
      title: 'Tax Calculator',
      description: 'PAYE & Business',
      icon: 'calculator',
      color: '#F77F00',
      onPress: () => router.push('/tax-calculator'),
    },
    {
      id: 'documents',
      title: 'Generate Doc',
      description: 'Legal templates',
      icon: 'document-text',
      color: '#0077B6',
      onPress: () => router.push('/(tabs)/documents'),
    },
    {
      id: 'rights',
      title: 'Your Rights',
      description: 'Know the law',
      icon: 'shield-checkmark',
      color: '#E63946',
      onPress: () => router.push('/know-your-rights'),
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Modern Header Section with Logo & Gradient */}
      <View style={styles.headerContainer}>
        <View style={styles.headerGlassBackground}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {user?.full_name || 'User'}!</Text>
            <Image
              source={require('../../public/logo/logo-white.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Upcoming Reminders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          <TouchableOpacity onPress={() => router.push('/reminders')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {upcomingReminders.length > 0 ? (
          upcomingReminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              title={reminder.title}
              date={formatDate(reminder.due_date)}
              type={reminder.type}
              onPress={() => router.push('/reminders')}
            />
          ))
        ) : (
          <TouchableOpacity
            style={styles.emptyReminderCard}
            onPress={() => router.push('/create-reminder')}
          >
            <Ionicons name="add-circle" size={32} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.emptyReminderTitle}>No Upcoming Reminders</Text>
              <Text style={styles.emptyReminderText}>
                Tap to create your first reminder
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <ActivityCard
          icon="chatbubbles"
          title="Chat with AI"
          subtitle="Asked about tenancy rights"
          time="2 hours ago"
        />
        <ActivityCard
          icon="document-text"
          title="Generated Document"
          subtitle="NDA Agreement"
          time="Yesterday"
        />
      </View>

      <View style={{ height: Platform.OS === 'ios' ? 100 : 90 }} />
    </ScrollView>
  );
}

interface ReminderCardProps {
  title: string;
  date: string;
  type: string;
  onPress?: () => void;
}

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

const ReminderCard: React.FC<ReminderCardProps> = ({ title, date, type, onPress }) => (
  <TouchableOpacity style={styles.reminderCard} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.reminderLeft}>
      <View style={[styles.reminderDot, { backgroundColor: getTypeColor(type) }]} />
      <View>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderDate}>{date}</Text>
      </View>
    </View>
    <Ionicons name="chevron-forward" size={20} color={colors.text.light} />
  </TouchableOpacity>
);

interface ActivityCardProps {
  icon: string;
  title: string;
  subtitle: string;
  time: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ icon, title, subtitle, time }) => (
  <View style={styles.activityCard}>
    <View style={styles.activityIcon}>
      <Ionicons name={icon as any} size={20} color={colors.primary} />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{title}</Text>
      <Text style={styles.activitySubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.activityTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    overflow: 'hidden',
    marginBottom: -15,
  },
  headerGlassBackground: {
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logo: {
    width: 140,
    height: 45,
  },
  greeting: {
    ...typography.h2,
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 16,
  },
  seeAll: {
    ...typography.body2,
    color: colors.primary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...colors.shadows?.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    ...typography.h4,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 4,
  },
  actionDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  reminderTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  reminderDate: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  activitySubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  activityTime: {
    ...typography.caption,
    color: colors.text.light,
  },
  emptyReminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    gap: 16,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyReminderTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyReminderText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
});
