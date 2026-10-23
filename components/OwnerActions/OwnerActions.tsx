import { Fragment } from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '../Box';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

interface OwnerActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  /** e.g. expired listings can't be edited */
  editDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Shared footer for things the user owns (listings, cimer posts) so they look and behave the same
export const OwnerActions = ({ onEdit, onDelete, editDisabled, style }: OwnerActionsProps) => {
  const actions = [
    onEdit && {
      key: 'edit',
      label: 'Modifiko',
      icon: 'create-outline' as const,
      onPress: onEdit,
      color: Colors.text,
      disabled: editDisabled,
    },
    onDelete && {
      key: 'delete',
      label: 'Fshi',
      icon: 'trash-outline' as const,
      onPress: onDelete,
      color: Colors.danger,
      disabled: false,
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
    color: string;
    disabled?: boolean;
  }[];

  if (!actions.length) return null;

  return (
    <Box style={[styles.bar, style]}>
      {actions.map((action, index) => (
        <Fragment key={action.key}>
          {index > 0 && <Box style={styles.divider} />}
          <Pressable
            onPress={action.onPress}
            disabled={action.disabled}
            accessibilityRole="button"
            style={({ pressed }) => [styles.action, pressed && styles.pressed, action.disabled && styles.disabled]}
          >
            <Ionicons name={action.icon} size={17} color={action.color} />
            <Text style={[styles.label, { color: action.color }]}>{action.label}</Text>
          </Pressable>
        </Fragment>
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  action: {
    flex: 1,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: Colors.cardBorder,
  },
  pressed: {
    backgroundColor: Colors.background,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
