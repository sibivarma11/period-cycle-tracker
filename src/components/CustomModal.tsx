import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING } from '../constants/AppTheme';

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  icon?: any;
}

export const CustomModal = ({
  visible,
  onClose,
  title,
  message,
  children,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  isDestructive = false,
  icon: Icon,
}: CustomModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView intensity={20} style={StyleSheet.absoluteFill} />
        <View style={styles.container}>
          <View style={styles.card}>
            {Icon && (
                <View style={[styles.iconContainer, isDestructive && styles.destructiveIconBg]}>
                    <Icon size={32} color={isDestructive ? COLORS.error : COLORS.primary} />
                </View>
            )}
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
            
            <View style={styles.content}>
                {children}
            </View>

            <View style={styles.buttonRow}>
              {onConfirm && (
                <TouchableOpacity 
                  onPress={onClose} 
                  style={[styles.button, styles.cancelButton]}
                >
                  <Text style={styles.cancelText}>{cancelText}</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={onConfirm || onClose} 
                style={[
                    styles.button, 
                    isDestructive ? styles.destructiveButton : styles.confirmButton
                ]}
              >
                <Text style={styles.confirmText}>{confirmText}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: Dimensions.get('window').width * 0.85,
    maxWidth: 400,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  destructiveIconBg: {
    backgroundColor: '#FFF0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  content: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    gap: SPACING.md,
  },
  button: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  destructiveButton: {
    backgroundColor: COLORS.error,
  },
  confirmText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  cancelText: {
    color: COLORS.textLight,
    fontWeight: '700',
    fontSize: 16,
  },
});
