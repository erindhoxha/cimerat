import { ReactNode, useState } from 'react';
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
        <Box style={[styles.accordionHeader, !open && { borderBottomRightRadius: 8, borderBottomLeftRadius: 8 }]}>
          <Text style={styles.headerText}>{!open ? title : closedTitle}</Text>
          <FontAwesome name={open ? 'chevron-up' : 'chevron-down'} size={12} color="#333" />
        </Box>
      </TouchableOpacity>
      {open && (
        <Box
          gap={12}
          padding={12}
          borderTopWidth={0}
          borderColor={Colors.gray}
          style={{
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            backgroundColor: Colors.white,
            borderWidth: 1,
            borderColor: Colors.gray,
          }}
        >
          {children}
        </Box>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  accordionHeader: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: Colors.yellow,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerText: {
    fontWeight: '500',
  },
});
