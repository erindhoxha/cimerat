import { Pressable, StyleSheet } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { Box } from '../Box';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

interface ChoiceChipsProps {
  label: string;
  options: readonly string[];
  value?: string | null;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  /** Short options (1, 2, 3…) share the row equally instead of sizing to their text */
  equalWidth?: boolean;
}

// One-tap alternative to a dropdown for short option lists
export const ChoiceChips = ({ label, options, value, onChange, required, error, equalWidth }: ChoiceChipsProps) => (
  <Box gap={8}>
    <Text style={styles.label}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    <Box flexDirection="row" gap={8} flexWrap="wrap" accessibilityRole="radiogroup">
      {options.map((option) => {
        const selected = value === option;
        return (
          <Pressable
            key={option}
            // Tapping the selected chip again clears it (these fields are optional)
            onPress={() => onChange(selected && !required ? '' : option)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            style={({ pressed }) => [
              styles.chip,
              equalWidth && styles.equal,
              selected && styles.selected,
              !!error && !selected && styles.error,
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[styles.text, selected && styles.selectedText]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </Box>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </Box>
);

// react-hook-form wrapper
export const ChoiceField = ({
  control,
  name,
  ...props
}: Omit<ChoiceChipsProps, 'value' | 'onChange'> & { control: Control<any>; name: string }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange } }) => <ChoiceChips {...props} value={value} onChange={onChange} />}
  />
);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textFade,
  },
  required: {
    color: Colors.danger,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  equal: {
    flexGrow: 1,
    flexBasis: 0,
    paddingHorizontal: 6,
  },
  selected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  error: {
    borderColor: Colors.danger,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedText: {
    color: Colors.onPrimary,
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
  },
});
