/**
 * NJ Jewellers — About Modal
 * Business contact details in a slide-up dark glass modal
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Colors, Fonts, FontSizes, BorderRadius, Spacing } from '../constants/theme';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.contactRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress}
    >
      <Text style={styles.contactIcon}>{icon}</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={[styles.contactValue, onPress && styles.contactValueTappable]}>
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export function AboutModal({ visible, onClose }: AboutModalProps) {
  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = () => {
    Linking.openURL('mailto:njjewellerschennai@gmail.com');
  };

  const handleMaps = () => {
    const address = '107, Kalathi Pillai Street, Sowcarpet, Chennai-600001';
    const encoded = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps:0,0?q=${encoded}`,
      android: `geo:0,0?q=${encoded}`,
      default: `https://maps.google.com/?q=${encoded}`,
    });
    Linking.openURL(url!);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
          {/* Handle bar */}
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.modalHeader}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.modalLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.modalTitle}>NJ Jewellers</Text>
              <Text style={styles.modalSubtitle}>24 Carat Gold</Text>
            </View>
          </View>

          {/* Director */}
          <View style={styles.directorBadge}>
            <Text style={styles.directorText}>Vishal Parekh — Director</Text>
          </View>

          {/* Contact details */}
          <View style={styles.contactList}>
            <ContactRow
              icon="📞"
              label="Phone"
              value="9884561992"
              onPress={() => handleCall('9884561992')}
            />
            <ContactRow
              icon="📠"
              label="Landline"
              value="9884834567"
              onPress={() => handleCall('9884834567')}
            />
            <ContactRow
              icon="✉️"
              label="Email"
              value="njjewellerschennai@gmail.com"
              onPress={handleEmail}
            />
            <ContactRow
              icon="📍"
              label="Address"
              value="24 Carat Gold, F1 1st flr, 107, Kalathi Pillai Street, Sowcarpet, Chennai-600001"
              onPress={handleMaps}
            />
          </View>

          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#141010',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl + 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderBottomWidth: 0,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  modalLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  modalTitle: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.white,
  },
  modalSubtitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.bodySmall,
    color: Colors.goldMuted,
    marginTop: 2,
  },
  directorBadge: {
    backgroundColor: 'rgba(123,31,31,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(123,31,31,0.25)',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignSelf: 'flex-start',
    marginBottom: Spacing.xl,
  },
  directorText: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSizes.bodySmall,
    color: Colors.textSecondary,
  },
  contactList: {
    gap: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
    gap: Spacing.md,
  },
  contactIcon: {
    fontSize: 18,
    marginTop: 2,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.micro,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  contactValue: {
    fontFamily: Fonts.bodyMedium,
    fontSize: FontSizes.body,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  contactValueTappable: {
    color: Colors.goldMuted,
  },
  closeButton: {
    marginTop: Spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  closeText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
});
