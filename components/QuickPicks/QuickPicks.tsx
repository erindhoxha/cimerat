import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

interface QuickPicksProps {
  options: readonly string[];
  /** Currently selected/typed value; the matching chip is highlighted */
  value?: string | null;
  onPick: (option: string) => void;
  /** How an option is labelled, e.g. 200 -> "200€" */
  format?: (option: string) => string;
}

// One-tap suggestions shown under a field; the field itself still accepts anything else
export const QuickPicks = ({ options, value, onPick, format = (o) => o }: QuickPicksProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={styles.row}
  >
    {options.map((option) => {
      const selected = value === option;
      return (
        <Pressable
          key={option}
          onPress={() => onPick(option)}
          accessibilityRole="button"
          accessibilityState={{ selected }}
          style={({ pressed }) => [styles.chip, selected && styles.selected, pressed && styles.pressed]}
        >
          <Text style={[styles.text, selected && styles.selectedText]}>{format(option)}</Text>
        </Pressable>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  row: {
    gap: 6,
    paddingTop: 8,
  },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
  },
  selected: {
    backgroundColor: Colors.accentSoft,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textFade,
  },
  selectedText: {
    color: Colors.accentInk,
  },
});
