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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';

export default function DocumentViewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: Load document from database/storage using the id
  // For now, showing a placeholder

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete from database
            Alert.alert('Success', 'Document deleted', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Document View</Text>
        </View>
        <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
          <Ionicons name="trash-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.content}>
        <View style={styles.placeholderCard}>
          <Ionicons name="document-text-outline" size={64} color={colors.text.light} />
          <Text style={styles.placeholderTitle}>Document History Coming Soon</Text>
          <Text style={styles.placeholderText}>
            This feature will allow you to view and manage your previously generated
            documents. For now, you can generate new documents and save them to your device.
          </Text>
          <TouchableOpacity
            style={styles.placeholderButton}
            onPress={() => router.push('/(tabs)/documents')}
          >
            <Text style={styles.placeholderButtonText}>Generate New Document</Text>
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
    fontSize: 20,
  },
  headerButton: {
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  placeholderCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...colors.shadows?.md,
  },
  placeholderTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderText: {
    ...typography.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  placeholderButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  placeholderButtonText: {
    ...typography.h4,
    color: colors.white,
  },
});
