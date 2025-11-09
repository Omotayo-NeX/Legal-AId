import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { colors, typography } from '../src/theme';
import { useDocumentStore } from '../src/store/documentStore';

export default function DocumentPreviewScreen() {
  const router = useRouter();
  const currentDocument = useDocumentStore((state) => state.currentDocument);
  const [isSaving, setIsSaving] = useState(false);

  // Extract document data from store
  const content = currentDocument?.content || '';
  const templateName = currentDocument?.templateName || 'Document';
  const templateId = currentDocument?.templateId || '';

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Create a filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `${templateName?.replace(/\s+/g, '_')}_${timestamp}.txt`;

      if (Platform.OS === 'web') {
        // For web, create a download
        const blob = new Blob([content || ''], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        Alert.alert('Success', 'Document downloaded successfully');
      } else {
        // For mobile, save to device
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, content || '', {
          encoding: FileSystem.EncodingType.UTF8,
        });

        Alert.alert(
          'Success',
          'Document saved successfully. Would you like to share it?',
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Share',
              onPress: () => handleShare(fileUri),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save document');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async (fileUri?: string) => {
    try {
      if (Platform.OS === 'web') {
        // For web, use Web Share API
        if (navigator.share) {
          await navigator.share({
            title: templateName,
            text: content,
          });
        } else {
          Alert.alert('Info', 'Sharing is not supported in this browser');
        }
      } else {
        // For mobile
        if (fileUri && (await Sharing.isAvailableAsync())) {
          await Sharing.shareAsync(fileUri);
        } else {
          await Share.share({
            message: content || '',
            title: templateName,
          });
        }
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handlePrint = () => {
    if (Platform.OS === 'web') {
      const printWindow = window.open('', '', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${templateName}</title>
              <style>
                body {
                  font-family: 'Times New Roman', serif;
                  padding: 40px;
                  line-height: 1.6;
                  max-width: 800px;
                  margin: 0 auto;
                }
                pre {
                  white-space: pre-wrap;
                  font-family: 'Times New Roman', serif;
                  font-size: 12pt;
                }
              </style>
            </head>
            <body>
              <pre>${content}</pre>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    } else {
      Alert.alert('Info', 'Print functionality is available on web platform');
    }
  };

  const handleSaveToHistory = () => {
    // TODO: Implement saving to local database/storage
    Alert.alert(
      'Coming Soon',
      'Document history feature will be available soon. For now, you can save the document to your device.',
      [
        { text: 'OK', style: 'cancel' },
        { text: 'Save to Device', onPress: handleSave },
      ]
    );
  };

  // Error handling: if no document is in store, show error
  if (!currentDocument) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Document Preview</Text>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.text.light} />
          <Text style={styles.errorTitle}>No Document Found</Text>
          <Text style={styles.errorMessage}>
            No document is currently available for preview. Please generate a document first.
          </Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.push('/(tabs)/documents')}
          >
            <Text style={styles.errorButtonText}>Go to Documents</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Document Preview</Text>
          <Text style={styles.headerSubtitle}>{templateName}</Text>
        </View>
        <TouchableOpacity onPress={() => handleShare()} style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer} contentContainerStyle={styles.content}>
        <View style={styles.documentCard}>
          <Text style={styles.documentText}>{content}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonSecondary]}
          onPress={handlePrint}
        >
          <Ionicons name="print-outline" size={20} color={colors.primary} />
          <Text style={styles.actionButtonTextSecondary}>Print</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Ionicons name="download-outline" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>
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
  headerSubtitle: {
    ...typography.body2,
    color: colors.white + 'CC',
    marginTop: 4,
  },
  headerButton: {
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  documentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    ...colors.shadows?.md,
    marginBottom: 20,
  },
  documentText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    lineHeight: 20,
    color: colors.text.primary,
    whiteSpace: 'pre-wrap',
  },
  footer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonSecondary: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 16,
  },
  actionButtonTextSecondary: {
    ...typography.h4,
    color: colors.primary,
    fontSize: 16,
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
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  errorButtonText: {
    ...typography.h4,
    color: colors.white,
    fontSize: 16,
  },
});
