import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JobStatus } from '../../types';
import { COLORS, SIZES, RADIUS, SPACING } from '../../constants/theme';

interface StatusBadgeProps {
  status: JobStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<JobStatus, { bg: string; text: string; label: string }> = {
  'กำลังโปรับของ': { bg: '#FEF3C7', text: '#D97706', label: 'กำลังโปรับของ' },
  'รอรับของ':       { bg: '#DCFCE7', text: '#16A34A', label: 'รอรับของ' },
  'กำลังเดินทาง':  { bg: '#DBEAFE', text: '#2563EB', label: 'กำลังเดินทาง' },
  'มีปัญหา':        { bg: '#FEE2E2', text: '#DC2626', label: 'มีปัญหา' },
  'กำลังติดตั้ง':   { bg: '#F3E8FF', text: '#7C3AED', label: 'กำลังติดตั้ง' },
  'รอลูกค้าเซ็น':  { bg: '#FCE7F3', text: '#BE185D', label: 'รอลูกค้าเซ็น' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || { bg: COLORS.gray100, text: COLORS.gray600, label: status };
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.bg },
        isSmall && styles.badgeSm,
      ]}
    >
      <Text style={[styles.text, { color: config.text }, isSmall && styles.textSm]}>
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  badgeSm: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
  },
  text: {
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
  textSm: {
    fontSize: SIZES.xs,
  },
});
