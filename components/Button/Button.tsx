import { StyleSheet, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger';

const THEME: Record<Variant, { container: ViewStyle; color: string }> = {
  primary: { container: { backgroundColor: Colors.primary }, color: Colors.onPrimary },
  secondary: { container: { backgroundColor: Colors.lightGray }, color: Colors.text },
  tertiary: {
    container: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.borderStrong },
    color: Colors.text,
  },
  danger: { container: { backgroundColor: Colors.danger }, color: Colors.white },
};

export const Button = (
  props: TouchableOpacityProps & {
    variant?: Variant;
    /** Rendered next to the label, vertically centered with it */
    icon?: React.ComponentProps<typeof Ionicons>['name'];
    iconColor?: string;
  },
) => {
  const theme = THEME[props.variant || 'primary'];
  const label = (
    <Text fontWeight="semibold" style={[styles.label, { color: theme.color }]}>
      {props.children}
    </Text>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      {...props}
      style={[styles.button, theme.container, props.disabled && styles.disabled, props.style]}
    >
      {props.icon ? (
        <View style={styles.row}>
          <Ionicons name={props.icon} size={18} color={props.iconColor ?? theme.color} />
          {label}
        </View>
      ) : (
        label
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
