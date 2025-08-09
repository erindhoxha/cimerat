import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  asterisk: {
    color: 'red',
  },
  dropdownItemSelected: {
    backgroundColor: '#D2D9DF',
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
  },
  dropdownItemStyle: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
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
  dropdownButtonTxtDisabledStyle: {
    color: '#aaa',
  },
  error: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 10,
  },
});
