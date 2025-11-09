import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../src/theme';
import { getTemplateById, DocumentTemplate, TemplateField } from '../src/templates';
import { useDocumentStore } from '../src/store/documentStore';

export default function DocumentGeneratorScreen() {
  const router = useRouter();
  const { templateId } = useLocalSearchParams<{ templateId: string }>();
  const setDocument = useDocumentStore((state) => state.setDocument);
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (templateId) {
      const loadedTemplate = getTemplateById(templateId as string);
      if (loadedTemplate) {
        setTemplate(loadedTemplate);
        // Initialize form data
        const initialData: Record<string, any> = {};
        loadedTemplate.fields.forEach((field) => {
          initialData[field.id] = '';
        });
        setFormData(initialData);
      }
    }
  }, [templateId]);

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    template?.fields.forEach((field) => {
      if (field.required && !formData[field.id]?.toString().trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!template) return;

    try {
      const generatedContent = template.generateContent(formData);

      // Store the generated document in the document store
      setDocument({
        content: generatedContent,
        templateName: template.name,
        templateId: template.id,
        generatedAt: new Date(),
      });

      // Navigate to preview screen
      router.push('/document-preview');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate document. Please check your inputs.');
      console.error('Document generation error:', error);
    }
  };

  const renderField = (field: TemplateField) => {
    const hasError = errors[field.id];

    switch (field.type) {
      case 'textarea':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.textArea, hasError && styles.inputError]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.text.light}
              multiline
              numberOfLines={4}
              value={formData[field.id]}
              onChangeText={(value) => handleInputChange(field.id, value)}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'number':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, hasError && styles.inputError]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.text.light}
              keyboardType="numeric"
              value={formData[field.id]}
              onChangeText={(value) => handleInputChange(field.id, value)}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'date':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, hasError && styles.inputError]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.text.light}
              value={formData[field.id]}
              onChangeText={(value) => handleInputChange(field.id, value)}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      case 'select':
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <View style={styles.selectContainer}>
              {field.options?.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.selectOption,
                    formData[field.id] === option && styles.selectOptionActive,
                  ]}
                  onPress={() => handleInputChange(field.id, option)}
                >
                  <Text
                    style={[
                      styles.selectOptionText,
                      formData[field.id] === option && styles.selectOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );

      default: // text
        return (
          <View key={field.id} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[styles.input, hasError && styles.inputError]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.text.light}
              value={formData[field.id]}
              onChangeText={(value) => handleInputChange(field.id, value)}
            />
            {hasError && <Text style={styles.errorText}>{errors[field.id]}</Text>}
          </View>
        );
    }
  };

  if (!template) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Document Generator</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.text.light} />
          <Text style={styles.errorTitle}>Template Not Found</Text>
          <Text style={styles.errorMessage}>
            The requested template could not be loaded.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{template.name}</Text>
          <Text style={styles.headerSubtitle}>{template.description}</Text>
        </View>
      </View>

      <ScrollView style={styles.formContainer} contentContainerStyle={styles.formContent}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            Fill in all required fields marked with * to generate your document.
          </Text>
        </View>

        {template.fields.map((field) => renderField(field))}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerate}
            activeOpacity={0.8}
          >
            <Ionicons name="document-text" size={20} color={colors.white} />
            <Text style={styles.generateButtonText}>Generate Document</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  formContainer: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    paddingBottom: 40,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '15',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  infoText: {
    ...typography.body2,
    color: colors.text.secondary,
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 20,
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
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    ...typography.body1,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
  },
  selectContainer: {
    gap: 8,
  },
  selectOption: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectOptionActive: {
    backgroundColor: colors.primary + '15',
    borderColor: colors.primary,
  },
  selectOptionText: {
    ...typography.body1,
    color: colors.text.secondary,
  },
  selectOptionTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 24,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...colors.shadows?.md,
  },
  generateButtonText: {
    ...typography.h4,
    color: colors.white,
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
  },
});
