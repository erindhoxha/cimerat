import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  asterisk: {
    color: 'red',
  },
  placeholderStyle: {
    color: Colors.gray,
    fontSize: 14,
    height: '100%',
    width: '100%',
    padding: 14,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.yellow,
    color: 'white',
    borderColor: 'white',
  },
  dropdownButtonStyle: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
  },
  multiSelectStyle: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
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
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 24,
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#151E26',
  },
  searchInputStyle: {
    backgroundColor: Colors.gray,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonDisabledStyle: {
    backgroundColor: '#f3f3f3ff',
    opacity: 1,
    borderWidth: 0,
  },
  disabledMultiSelectStyle: {
    backgroundColor: '#f3f3f3ff',
    opacity: 1,
    borderWidth: 0,
  },
  dropdownButtonTxtDisabledStyle: {
    color: '#aaa',
  },
  error: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 10,
  },
});
