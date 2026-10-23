import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '../Box';
import Colors from '@/constants/Colors';

interface SearchBarProps {
  value: string;
  /** Called after the user pauses typing, so we don't query on every keystroke */
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
}

export const SearchBar = ({ value, onSearch, placeholder = 'Kërko...', delay = 350 }: SearchBarProps) => {
  const [text, setText] = useState(value);

  // Keep in sync when cleared from outside (e.g. "Pastro")
  useEffect(() => setText(value), [value]);

  useEffect(() => {
    if (text.trim() === value.trim()) return;
    const timeout = setTimeout(() => onSearch(text.trim()), delay);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <Box style={styles.container}>
      <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor={Colors.gray}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(text.trim())}
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel={placeholder}
      />
      {text.length > 0 && (
        <Pressable
          onPress={() => {
            setText('');
            onSearch('');
          }}
          hitSlop={10}
          accessibilityLabel="Pastro kërkimin"
          style={styles.clear}
        >
          <Ionicons name="close" size={14} color={Colors.white} />
        </Pressable>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 46,
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    backgroundColor: Colors.lightGray,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text,
  },
  clear: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
});
