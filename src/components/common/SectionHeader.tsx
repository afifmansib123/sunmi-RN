import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SPACING } from '../../constants/theme';

interface SectionHeaderProps {
  icon: string;
  title: string;
  rightText?: string;
  rightColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  rightText,
  rightColor = COLORS.primary,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {rightText && (
        <Text style={[styles.right, { color: rightColor }]}>{rightText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  icon: { fontSize: 16, marginRight: 6 },
  title: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
    flex: 1,
  },
  right: {
    fontSize: SIZES.sm,
    fontWeight: '600',
  },
});
