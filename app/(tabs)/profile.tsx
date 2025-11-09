import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, typography } from '../../src/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 'subscription',
      icon: 'diamond-outline',
      title: 'Subscription',
      subtitle: user?.subscription_tier === 'free' ? 'Free Plan' : 'Premium Plan',
      onPress: () => router.push('/subscription'),
      showBadge: user?.subscription_tier === 'free',
    },
    {
      id: 'reminders',
      icon: 'notifications-outline',
      title: 'Reminders',
      subtitle: 'Manage compliance reminders',
      onPress: () => router.push('/reminders'),
    },
    {
      id: 'saved-chats',
      icon: 'chatbubbles-outline',
      title: 'Saved Chats',
      subtitle: 'View chat history',
      onPress: () => router.push('/saved-chats'),
    },
    {
      id: 'know-your-rights',
      icon: 'shield-checkmark-outline',
      title: 'Know Your Rights',
      subtitle: 'Legal information library',
      onPress: () => router.push('/know-your-rights'),
    },
  ];

  const settingsItems = [
    {
      id: 'notifications',
      icon: 'notifications-outline',
      title: 'Notifications',
      onPress: () => router.push('/settings/notifications'),
    },
    {
      id: 'privacy',
      icon: 'lock-closed-outline',
      title: 'Privacy & Security',
      onPress: () => router.push('/settings/privacy'),
    },
    {
      id: 'help',
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => router.push('/help'),
    },
    {
      id: 'about',
      icon: 'information-circle-outline',
      title: 'About Legal AI.d',
      onPress: () => router.push('/about'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editAvatarButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons name="camera" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>

        {/* User Info Details */}
        {user?.phone_number && (
          <View style={styles.userInfoRow}>
            <Ionicons name="call-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.userInfoText}>{user.phone_number}</Text>
          </View>
        )}

        <View style={styles.userInfoRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.text.secondary} />
          <Text style={styles.userInfoText}>
            Member since {new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </Text>
        </View>

        {user?.subscription_tier && (
          <View
            style={[
              styles.badge,
              user.subscription_tier === 'free'
                ? styles.freeBadge
                : styles.premiumBadge,
            ]}
          >
            <Ionicons
              name={user.subscription_tier === 'free' ? 'person-outline' : 'diamond-outline'}
              size={14}
              color={user.subscription_tier === 'free' ? colors.text.primary : colors.primary}
            />
            <Text style={styles.badgeText}>
              {user.subscription_tier.toUpperCase()} PLAN
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => router.push('/edit-profile')}
        >
          <Ionicons name="create-outline" size={18} color={colors.primary} />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Main Menu */}
      <View style={styles.section}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon as any} size={24} color={colors.primary} />
              </View>
              <View style={styles.menuInfo}>
                <View style={styles.menuTitleRow}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.showBadge && (
                    <View style={styles.upgradeBadge}>
                      <Text style={styles.upgradeBadgeText}>Upgrade</Text>
                    </View>
                  )}
                </View>
                {item.subtitle && (
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                )}
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.light}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name={item.icon as any}
                size={20}
                color={colors.text.secondary}
                style={styles.settingsIcon}
              />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.text.light}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Legal AI.d v1.0.0</Text>
      </View>

      <View style={{ height: Platform.OS === 'ios' ? 100 : 90 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  userCard: {
    backgroundColor: colors.white,
    alignItems: 'center',
    padding: 32,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  avatarText: {
    ...typography.h1,
    fontSize: 40,
    color: colors.white,
  },
  userName: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  userInfoText: {
    ...typography.body2,
    color: colors.text.secondary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  freeBadge: {
    backgroundColor: colors.gray[200],
  },
  premiumBadge: {
    backgroundColor: colors.primary + '20',
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text.primary,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileText: {
    ...typography.body1,
    color: colors.primary,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.white,
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.text.secondary,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsIcon: {
    marginRight: 12,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  menuSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
    marginTop: 2,
  },
  upgradeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  upgradeBadgeText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  signOutText: {
    ...typography.body1,
    color: colors.error,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.light,
  },
});
