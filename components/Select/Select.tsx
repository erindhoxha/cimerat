import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TextInput, useWindowDimensions } from 'react-native';
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '../Box';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

type Option = string | number;

interface BaseProps<T extends Option> {
  options: readonly T[];
  label?: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  /** Title of the sheet, defaults to label/placeholder */
  title?: string;
  /** How an option is shown in the list and the trigger */
  formatOption?: (option: T) => string;
  /** Shows a search field; defaults to on for lists longer than 10 */
  searchable?: boolean;
  /** Replaces the default input-style trigger (and label), e.g. with a filter chip */
  renderTrigger?: (trigger: { open: () => void; text: string | null; disabled?: boolean }) => React.ReactNode;
}

interface SingleProps<T extends Option> extends BaseProps<T> {
  multiple?: false;
  value: T | null | undefined;
  onChange: (value: T | null) => void;
  /** Tapping the selected option again clears it */
  clearable?: boolean;
}

interface MultiProps<T extends Option> extends BaseProps<T> {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
}

export type SelectProps<T extends Option> = SingleProps<T> | MultiProps<T>;

const DURATION = 220;

// Keeps highlighted (selected) rows from touching each other
const OptionGap = () => <Box style={{ height: 4 }} />;

export function Select<T extends Option>(props: SelectProps<T>) {
  const { options, label, placeholder, required, disabled, error, formatOption = String } = props;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  // Multi-select edits a draft so "Pastro" / backdrop-dismiss behave predictably
  const [draft, setDraft] = useState<T[]>([]);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const progress = useSharedValue(0);
  const searchable = props.searchable ?? options.length > 10;

  useEffect(() => {
    if (open) {
      setMounted(true);
      progress.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) });
    } else if (mounted) {
      progress.value = withTiming(0, { duration: DURATION - 40, easing: Easing.in(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setMounted)(false);
      });
    }
  }, [open]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * windowHeight * 0.6 }],
  }));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => formatOption(o).toLowerCase().includes(q)) : options;
  }, [options, query, formatOption]);

  const show = () => {
    if (disabled) return;
    setQuery('');
    if (props.multiple) setDraft(props.value);
    setOpen(true);
  };

  const isSelected = (option: T) => (props.multiple ? draft.includes(option) : props.value === option);

  const onPressOption = (option: T) => {
    if (props.multiple) {
      setDraft((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]));
      return;
    }
    props.onChange(props.clearable && props.value === option ? null : option);
    setOpen(false);
  };

  const triggerText = props.multiple
    ? props.value.length === 0
      ? null
      : props.value.length <= 2
        ? props.value.map(formatOption).join(', ')
        : `${formatOption(props.value[0])} +${props.value.length - 1}`
    : props.value !== null && props.value !== undefined && props.value !== ''
      ? formatOption(props.value)
      : null;

  return (
    <Box gap={6}>
      {props.renderTrigger ? (
        props.renderTrigger({ open: show, text: triggerText, disabled })
      ) : (
        <>
          {label && (
            <Text style={styles.label}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
          )}
          <Pressable
            onPress={show}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={label ?? placeholder}
            style={({ pressed }) => [
              styles.trigger,
              disabled && styles.triggerDisabled,
              !!error && styles.triggerError,
              pressed && styles.triggerPressed,
            ]}
          >
            <Text style={[styles.triggerText, !triggerText && styles.placeholder]} numberOfLines={1}>
              {triggerText ?? placeholder}
            </Text>
            <Ionicons name="chevron-down" size={16} color={disabled ? Colors.gray : Colors.textMuted} />
          </Pressable>
          {!!error && <Text style={styles.error}>{error}</Text>}
        </>
      )}

      <Modal visible={mounted} transparent statusBarTranslucent onRequestClose={() => setOpen(false)}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessibilityLabel="Mbyll" />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { maxHeight: windowHeight * 0.75, paddingBottom: insets.bottom + 12 }, sheetStyle]}
        >
          <Box style={styles.grabber} />
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" marginBottom={12}>
            <Text style={styles.sheetTitle}>{props.title ?? label ?? placeholder}</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.closeButton} hitSlop={8}>
              <Ionicons name="close" size={18} color={Colors.text} />
            </Pressable>
          </Box>

          {searchable && (
            <Box style={styles.search}>
              <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Kërko..."
                placeholderTextColor={Colors.gray}
                style={styles.searchInput}
                autoCorrect={false}
                clearButtonMode="while-editing"
              />
            </Box>
          )}

          <FlatList
            data={filtered as T[]}
            keyExtractor={(item) => String(item)}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={20}
            style={styles.list}
            ItemSeparatorComponent={OptionGap}
            ListEmptyComponent={<Text style={styles.empty}>Asnjë rezultat</Text>}
            renderItem={({ item }) => {
              const selected = isSelected(item);
              return (
                <Pressable
                  onPress={() => onPressOption(item)}
                  style={({ pressed }) => [
                    styles.option,
                    selected && styles.optionSelected,
                    pressed && styles.optionPressed,
                  ]}
                  accessibilityRole={props.multiple ? 'checkbox' : 'radio'}
                  accessibilityState={{ checked: selected }}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{formatOption(item)}</Text>
                  {props.multiple ? (
                    <Box style={[styles.checkbox, selected && styles.checkboxSelected]}>
                      {selected && <Ionicons name="checkmark" size={14} color={Colors.onPrimary} />}
                    </Box>
                  ) : (
                    selected && <Ionicons name="checkmark" size={20} color={Colors.text} />
                  )}
                </Pressable>
              );
            }}
          />

          {props.multiple && (
            <Box flexDirection="row" gap={10} marginTop={12}>
              <Pressable style={[styles.footerButton, styles.footerSecondary]} onPress={() => setDraft([])}>
                <Text style={styles.footerSecondaryText}>Pastro</Text>
              </Pressable>
              <Pressable
                style={[styles.footerButton, styles.footerPrimary]}
                onPress={() => {
                  (props as MultiProps<T>).onChange(draft);
                  setOpen(false);
                }}
              >
                <Text style={styles.footerPrimaryText}>Gati{draft.length > 0 ? ` (${draft.length})` : ''}</Text>
              </Pressable>
            </Box>
          )}
        </Animated.View>
      </Modal>
    </Box>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textFade,
  },
  required: {
    color: Colors.danger,
  },
  trigger: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.surface,
  },
  triggerPressed: {
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.background,
  },
  triggerDisabled: {
    backgroundColor: Colors.lightGray,
    borderColor: Colors.lightGray,
  },
  triggerError: {
    borderColor: Colors.danger,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
  },
  placeholder: {
    color: Colors.gray,
  },
  error: {
    color: Colors.danger,
    fontSize: 12,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,11,15,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: Colors.text,
  },
  list: {
    flexGrow: 0,
  },
  option: {
    minHeight: 50,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: Colors.accentSoft,
  },
  optionPressed: {
    backgroundColor: Colors.lightGray,
  },
  optionText: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    color: Colors.text,
  },
  optionTextSelected: {
    fontWeight: '600',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  empty: {
    textAlign: 'center',
    color: Colors.textMuted,
    paddingVertical: 24,
  },
  footerButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerSecondary: {
    backgroundColor: Colors.lightGray,
  },
  footerSecondaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  footerPrimary: {
    backgroundColor: Colors.primary,
  },
  footerPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onPrimary,
  },
});
