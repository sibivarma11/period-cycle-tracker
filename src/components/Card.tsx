import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import { COLORS, SPACING } from '../constants/AppTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
}

export const Card = ({ children, style, title }: CardProps) => (
  <View style={[styles.card, style]}>
    {title && <Text style={styles.title}>{title}</Text>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 14,
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
});
