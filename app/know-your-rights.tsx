import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';
import { rightsCategories } from '../src/data/rights';

export default function KnowYourRightsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = rightsCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.rights.some(
        (right) =>
          right.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          right.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Know Your Rights</Text>
          <Text style={styles.headerSubtitle}>Empowering you with legal knowledge</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.text.light} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search rights and laws..."
          placeholderTextColor={colors.text.light}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.text.light} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Nigerian Law Compendium</Text>
            <Text style={styles.infoText}>
              This section covers your legal rights under Nigerian law. Tap any category to
              learn more.
            </Text>
          </View>
        </View>

        {/* Categories Grid */}
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Search Results' : 'Rights Categories'}
        </Text>

        {filteredCategories.length > 0 ? (
          <View style={styles.grid}>
            {filteredCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() =>
                  router.push(`/rights-category?categoryId=${category.id}`)
                }
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color + '20' },
                  ]}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={32}
                    color={category.color}
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryDescription}>
                  {category.description}
                </Text>
                <View style={styles.categoryFooter}>
                  <Text style={styles.categoryCount}>
                    {category.rights.length} topics
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="search-outline"
              size={64}
              color={colors.text.light}
            />
            <Text style={styles.emptyTitle}>No Results Found</Text>
            <Text style={styles.emptyText}>
              Try searching with different keywords
            </Text>
          </View>
        )}

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.text.secondary} />
          <Text style={styles.disclaimerText}>
            This information is for educational purposes only and does not constitute legal
            advice. For specific legal matters, please consult a qualified lawyer.
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
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.white,
    fontSize: 22,
  },
  headerSubtitle: {
    ...typography.body2,
    color: colors.primary,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    ...typography.body1,
    color: colors.text.primary,
  },
  content: {
    padding: 20,
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
  infoTitle: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    ...typography.body2,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    gap: 16,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    ...colors.shadows?.md,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryName: {
    ...typography.h4,
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 6,
  },
  categoryDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 16,
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  categoryCount: {
    ...typography.caption,
    color: colors.text.secondary,
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
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
});
