import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry;
  const showPassword = isPassword && !isPasswordVisible;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainer_focused,
          error && styles.inputContainer_error,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={colors.text.secondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[styles.input, leftIcon && styles.input_withLeftIcon]}
          placeholderTextColor={colors.text.light}
          secureTextEntry={showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.label,
    color: colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  inputContainer_focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputContainer_error: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.body1,
    color: colors.text.primary,
    paddingVertical: 14,
  },
  input_withLeftIcon: {
    paddingLeft: 8,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    padding: 4,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: 4,
  },
});
