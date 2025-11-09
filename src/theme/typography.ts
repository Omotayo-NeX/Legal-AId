import { TextStyle } from 'react-native';

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  } as TextStyle,

  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
  } as TextStyle,

  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  } as TextStyle,

  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  } as TextStyle,

  // Body Text
  body1: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } as TextStyle,

  body2: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } as TextStyle,

  // UI Text
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  } as TextStyle,

  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  } as TextStyle,

  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  } as TextStyle,
};
