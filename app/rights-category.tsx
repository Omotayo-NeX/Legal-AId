import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';
import { rightsCategories } from '../src/data/rights';

export default function RightsCategoryScreen() {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const category = rightsCategories.find((cat) => cat.id === categoryId);

  if (!category) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Category Not Found</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.text.light} />
          <Text style={styles.errorTitle}>Category Not Found</Text>
          <Text style={styles.errorMessage}>
            The requested category could not be loaded.
          </Text>
        </View>
      </View>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <Ionicons name={category.icon as any} size={28} color={colors.white} />
          </View>
          <View style={styles.headerTextContent}>
            <Text style={styles.headerTitle}>{category.name}</Text>
            <Text style={styles.headerSubtitle}>{category.description}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Ionicons name="book" size={24} color={category.color} />
            <Text style={styles.statNumber}>{category.rights.length}</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="shield-checkmark" size={24} color={category.color} />
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>Nigerian Law</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Rights</Text>

        {category.rights.map((right, index) => {
          const isExpanded = expandedId === right.id;

          return (
            <View key={right.id} style={styles.rightCard}>
              <TouchableOpacity
                style={styles.rightHeader}
                onPress={() => toggleExpand(right.id)}
                activeOpacity={0.7}
              >
                <View style={styles.rightHeaderLeft}>
                  <View
                    style={[
                      styles.rightNumber,
                      { backgroundColor: category.color + '20' },
                    ]}
                  >
                    <Text style={[styles.rightNumberText, { color: category.color }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.rightInfo}>
                    <Text style={styles.rightTitle}>{right.title}</Text>
                    <Text style={styles.rightDescription}>{right.description}</Text>
                  </View>
                </View>
                <Ionicons
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={category.color}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.rightContent}>
                  <View
                    style={[
                      styles.contentDivider,
                      { backgroundColor: category.color + '30' },
                    ]}
                  />
                  <Text style={styles.contentText}>{right.content}</Text>

                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: category.color + '15' },
                      ]}
                      onPress={() => {
                        /* Share functionality */
                      }}
                    >
                      <Ionicons name="share-outline" size={18} color={category.color} />
                      <Text style={[styles.actionButtonText, { color: category.color }]}>
                        Share
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        { backgroundColor: category.color + '15' },
                      ]}
                      onPress={() => router.push('/(tabs)/chat')}
                    >
                      <Ionicons name="chatbubbles-outline" size={18} color={category.color} />
                      <Text style={[styles.actionButtonText, { color: category.color }]}>
                        Ask AI
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}

        {/* Help Card */}
        <View style={styles.helpCard}>
          <Ionicons name="help-circle" size={32} color={colors.primary} />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Need Legal Help?</Text>
            <Text style={styles.helpText}>
              Our AI assistant can help answer questions about these rights or connect you
              with legal resources.
            </Text>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => router.push('/(tabs)/chat')}
            >
              <Text style={styles.helpButtonText}>Chat with AI</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
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
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontSize: 24,
    marginBottom: 4,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    padding: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    ...colors.shadows?.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  statNumber: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 16,
  },
  rightCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    ...colors.shadows?.sm,
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  rightHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  rightNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightNumberText: {
    ...typography.h4,
    fontSize: 16,
    fontWeight: '700',
  },
  rightInfo: {
    flex: 1,
  },
  rightTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  rightDescription: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  rightContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contentDivider: {
    height: 2,
    marginBottom: 16,
    borderRadius: 1,
  },
  contentText: {
    ...typography.body2,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonText: {
    ...typography.body2,
    fontWeight: '600',
  },
  helpCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: 16,
    padding: 20,
    marginTop: 12,
    flexDirection: 'row',
    gap: 16,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 6,
  },
  helpText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  helpButtonText: {
    ...typography.body2,
    color: colors.white,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
