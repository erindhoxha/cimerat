import { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
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
          <Text style={styles.headerText}>{!open ? title : closedTitle}</Text>
          <FontAwesome name={open ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.gray} />
        </Box>
      </TouchableOpacity>
      {open && <Box style={styles.accordionContent}>{children}</Box>}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
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
    fontWeight: '400',
  },
  accordionContent: {
    gap: 12,
    padding: 12,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: Colors.white,
  },
});
