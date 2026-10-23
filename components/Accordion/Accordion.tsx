import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../Text';
import { Box } from '../Box';
import Colors from '@/constants/Colors';

interface AccordionViewProps {
  title?: string;
  children?: ReactNode;
  open: boolean;
  closedTitle?: string;
  setOpen: (open: boolean) => void;
}

export function AccordionView({
  title = 'Filtro më shumë',
  closedTitle = 'Largo filterin',
  children,
  open,
  setOpen,
}: AccordionViewProps) {
  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <Box style={[styles.accordionHeader, !open && styles.accordionHeaderClosed]}>
          <Box flexDirection="row" alignItems="center" gap={10}>
            <Ionicons name="options-outline" size={16} color={Colors.text} />
            <Text style={styles.headerText}>{!open ? title : closedTitle}</Text>
          </Box>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={12} color={Colors.textMuted} />
        </Box>
      </TouchableOpacity>
      {open && <Box style={styles.accordionContent}>{children}</Box>}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionHeader: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionHeaderClosed: {
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  headerText: {
    fontWeight: '500',
    fontSize: 15,
    color: Colors.text,
  },
  accordionContent: {
    gap: 16,
    padding: 14,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: Colors.white,
  },
});
