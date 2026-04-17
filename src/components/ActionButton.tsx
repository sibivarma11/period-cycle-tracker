import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS, SPACING } from '../constants/AppTheme';

interface ActionButtonProps {
  onPress: () => void;
  title: string;
  icon?: any;
  secondary?: boolean;
}

export const ActionButton = ({ onPress, title, icon: Icon, secondary }: ActionButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <LinearGradient
        colors={secondary ? [COLORS.card, COLORS.card] : GRADIENTS.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, secondary && styles.secondaryBorder]}
      >
        {Icon && <Icon size={20} color={secondary ? COLORS.primary : '#FFF'} style={styles.icon} />}
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
    width: '100%',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 30,
    paddingHorizontal: SPACING.xl,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: COLORS.primary,
  },
  icon: {
    marginRight: SPACING.sm,
  },
});
