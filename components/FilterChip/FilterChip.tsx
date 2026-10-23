import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '../Box';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

interface FilterChipProps {
  label: string;
  /** The selected value; when set the chip shows it and renders as active */
  value?: string | null;
  onPress: () => void;
  disabled?: boolean;
  /** Pressing a disabled chip calls this (e.g. to explain why) instead of doing nothing */
  onDisabledPress?: () => void;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

export const FilterChip = ({ label, value, onPress, disabled, onDisabledPress, icon }: FilterChipProps) => {
  const active = !!value;
  const color = active ? Colors.onPrimary : disabled ? Colors.gray : Colors.text;

  return (
    <Pressable
      onPress={disabled ? onDisabledPress : onPress}
      disabled={disabled && !onDisabledPress}
      accessibilityRole="button"
      accessibilityLabel={active ? `${label}: ${value}` : label}
      accessibilityState={{ disabled, selected: active }}
      style={({ pressed }) => [
        styles.chip,
        active && styles.active,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {icon && <Ionicons name={icon} size={15} color={color} />}
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {value || label}
      </Text>
      <Ionicons name="chevron-down" size={13} color={color} />
    </Pressable>
  );
};

// "Pastro (n)" chip shown first in a filter bar while any filter is active
export const ClearFiltersChip = ({ count, onPress }: { count: number; onPress: () => void }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.clearChip, pressed && styles.pressed]}
    accessibilityRole="button"
    accessibilityLabel="Pastro filtrat"
  >
    <Box style={styles.clearIcon}>
      <Ionicons name="close" size={11} color={Colors.white} />
    </Box>
    <Text style={styles.clearChipText}>Pastro ({count})</Text>
  </Pressable>
);

// Horizontal bar the chips sit in, pinned above a list
export const filterBarStyles = StyleSheet.create({
  bar: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  row: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
  },
});

const styles = StyleSheet.create({
  clearChip: {
    height: 38,
    paddingLeft: 8,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
  },
  clearIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.text,
  },
  clearChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  chip: {
    height: 38,
    maxWidth: 200,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.surface,
  },
  active: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  disabled: {
    borderColor: Colors.lightGray,
    backgroundColor: Colors.lightGray,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
});
