import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../../src/theme';

export default function DocumentsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');

  const templates = [
    {
      id: '1',
      name: 'Tenancy Agreement',
      description: 'Standard residential tenancy agreement',
      category: 'tenancy',
      icon: 'home',
      color: colors.primary,
    },
    {
      id: '2',
      name: 'Non-Disclosure Agreement',
      description: 'Mutual NDA for business discussions',
      category: 'business',
      icon: 'lock-closed',
      color: '#F77F00',
    },
    {
      id: '3',
      name: 'Employment Contract',
      description: 'Standard employment agreement template',
      category: 'employment',
      icon: 'briefcase',
      color: '#0077B6',
    },
    {
      id: '4',
      name: 'Loan Agreement',
      description: 'Personal or business loan contract',
      category: 'business',
      icon: 'cash',
      color: '#E63946',
    },
    {
      id: '5',
      name: 'Affidavit',
      description: 'General purpose affidavit template',
      category: 'affidavit',
      icon: 'document-text',
      color: '#7209B7',
    },
    {
      id: '6',
      name: 'Power of Attorney',
      description: 'Legal authorization document',
      category: 'other',
      icon: 'finger-print',
      color: '#2A9D8F',
    },
  ];

  const history = [
    {
      id: '1',
      name: 'Tenancy Agreement - Lekki Apartment',
      date: '2025-10-28',
      type: 'tenancy',
    },
    {
      id: '2',
      name: 'NDA - Tech Startup Partnership',
      date: '2025-10-25',
      type: 'business',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'templates' && styles.activeTab]}
          onPress={() => setActiveTab('templates')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'templates' && styles.activeTabText,
            ]}
          >
            Templates
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'history' && styles.activeTabText,
            ]}
          >
            My Documents
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'templates' ? (
          <>
            <Text style={styles.sectionTitle}>Choose a Template</Text>
            <View style={styles.grid}>
              {templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={styles.templateCard}
                  onPress={() =>
                    router.push(`/document-generator?templateId=${template.id}`)
                  }
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.templateIcon,
                      { backgroundColor: template.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={template.icon as any}
                      size={28}
                      color={template.color}
                    />
                  </View>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateDescription}>
                    {template.description}
                  </Text>
                  <View style={styles.templateFooter}>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={colors.primary}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Generated Documents</Text>
            {history.length > 0 ? (
              history.map((doc) => (
                <TouchableOpacity
                  key={doc.id}
                  style={styles.historyCard}
                  onPress={() => router.push(`/document-view?id=${doc.id}`)}
                >
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIcon}>
                      <Ionicons
                        name="document-text"
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyName}>{doc.name}</Text>
                      <Text style={styles.historyDate}>
                        Created on{' '}
                        {new Date(doc.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={colors.text.light}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons
                  name="folder-open-outline"
                  size={64}
                  color={colors.text.light}
                />
                <Text style={styles.emptyTitle}>No Documents Yet</Text>
                <Text style={styles.emptyText}>
                  Generate your first document from the Templates tab
                </Text>
              </View>
            )}
          </>
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
  content: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: 16,
  },
  grid: {
    gap: 16,
  },
  templateCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    ...colors.shadows?.md,
  },
  templateIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  templateName: {
    ...typography.h4,
    fontSize: 18,
    color: colors.text.primary,
    marginBottom: 4,
  },
  templateDescription: {
    ...typography.body2,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  historyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyInfo: {
    flex: 1,
  },
  historyName: {
    ...typography.body1,
    color: colors.text.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDate: {
    ...typography.caption,
    color: colors.text.secondary,
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
});
