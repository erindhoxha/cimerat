import { Control, Controller } from 'react-hook-form';
import SelectDropdown from 'react-native-select-dropdown';
import { Box } from '@/components/Box';
import Label from '@/components/Label';
import { Text } from '@/components/Text';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from './styles';

interface DropdownFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  rules?: any;
  error?: string;
  required?: boolean;
  dropdownStyle?: StyleProp<ViewStyle>;
  search?: boolean;
  searchPlaceHolder?: string;
  searchPlaceHolderColor?: string;
  defaultValue?: string;
}

interface SelectValueProps {
  value: string | undefined;
  title: string | undefined;
  isOpened: boolean;
  placeholder: string;
  disabled?: boolean;
  error?: string;
}

const SelectValue = ({ value, title, isOpened, placeholder, disabled, error }: SelectValueProps) => (
  <Box
    style={[
      styles.dropdownButtonStyle,
      disabled ? styles.dropdownButtonDisabledStyle : null,
      error && !disabled ? styles.dropdownButtonErrorStyle : null,
    ]}
  >
    <Text
      style={[
        styles.dropdownButtonTxtStyle,
        disabled ? styles.dropdownButtonTxtDisabledStyle : null,
        {
          color: value ? '#000' : '#ccc',
        },
      ]}
    >
      {title || placeholder}
    </Text>
    <Text>
      <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} />
    </Text>
  </Box>
);

export function DropdownField({
  control,
  name,
  label,
  options,
  placeholder,
  disabled,
  rules,
  error,
  required,
  defaultValue,
  dropdownStyle,
  ...dropdownProps
}: DropdownFieldProps) {
  return (
    <Box flex={1}>
      <Label>
        {label}
        {required && <Text style={styles.asterisk}>*</Text>}
      </Label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={({ field: { onChange, value } }) => (
          <SelectDropdown
            data={options}
            onSelect={onChange}
            disabled={disabled}
            searchInputStyle={styles.searchInputStyle}
            renderButton={(_: any, isOpened: boolean) => {
              return (
                <>
                  <SelectValue
                    value={value === 'undefined' ? undefined : value}
                    title={value === 'undefined' ? undefined : value ?? placeholder ?? ''}
                    isOpened={isOpened}
                    placeholder={placeholder}
                    disabled={disabled}
                    error={error}
                  />
                </>
              );
            }}
            renderItem={(item: string, _: number, isSelected: boolean) => (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            )}
            {...dropdownProps}
          />
        )}
      />
      {error && !disabled && <Text style={styles.error}>{error}</Text>}
    </Box>
  );
}
