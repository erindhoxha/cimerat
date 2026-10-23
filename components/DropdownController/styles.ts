import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  asterisk: {
    color: 'red',
  },
  placeholderGray: {
    color: Colors.gray,
  },
  placeholderStyle: {
    fontSize: 14,
    height: '100%',
    width: '100%',
    padding: 14,
    cursor: 'pointer',
  },
  dropdownItemSelected: {
    backgroundColor: Colors.accentSoft,
    borderColor: 'white',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 14,
  },
  multiSelectStyle: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    outline: Colors.primary,
    minHeight: 48,
    backgroundColor: Colors.surface,
    fontSize: 14,
  },
  dropdownButtonErrorStyle: {
    borderColor: Colors.danger,
    borderWidth: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
  },
  dropdownMenuStyle: {
    borderRadius: 12,
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 12,
    overflow: 'scroll',
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dropdownRenderedButtonStyle: {
    outlineColor: Colors.primary,
    borderRadius: 12,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  searchInputStyle: {
    backgroundColor: Colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonDisabledStyle: {
    backgroundColor: Colors.lightGray,
    opacity: 1,
    borderWidth: 0,
  },
  disabledMultiSelectStyle: {
    backgroundColor: Colors.lightGray,
    opacity: 1,
    borderWidth: 0,
  },
  dropdownButtonTxtDisabledStyle: {
    color: Colors.gray,
  },
  error: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 10,
  },
});
