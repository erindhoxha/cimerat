import { Control, Controller } from "react-hook-form";
import SelectDropdown from "react-native-select-dropdown";
import { Box } from "@/components/Box";
import Label from "@/components/Label";
import { Text } from "@/components/Text";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SelectValueProps } from "@/app/create/types";
import { styles } from "./styles";

interface DropdownFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  rules?: any;
  error?: string;
  dropdownStyle?: StyleProp<ViewStyle>;
  search?: boolean;
  searchPlaceHolder?: string;
  searchPlaceHolderColor?: string;
}

const SelectValue = ({ value, title, isOpened, placeholder, disabled }: SelectValueProps) => (
  <Box style={[styles.dropdownButtonStyle, disabled ? styles.dropdownButtonDisabledStyle : null]}>
    <Text
      style={[
        styles.dropdownButtonTxtStyle,
        disabled ? styles.dropdownButtonTxtDisabledStyle : null,
        {
          color: value ? "#000" : "#ccc",
        },
      ]}>
      {title || placeholder}
    </Text>
    <Text>
      <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
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
  dropdownStyle,
  ...dropdownProps
}: DropdownFieldProps) {
  return (
    <Box flex={1} style={styles.dropdownContainerStyle}>
      <Label>
        {label}
        <Text style={{ color: "red" }}>*</Text>
      </Label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <SelectDropdown
            data={options}
            onSelect={onChange}
            disabled={disabled}
            searchInputStyle={styles.searchInputStyle}
            renderButton={(_: any, isOpened: boolean) => (
              <>
                <SelectValue
                  value={value}
                  title={value || placeholder}
                  isOpened={isOpened}
                  placeholder={placeholder}
                  disabled={disabled}
                />
              </>
            )}
            renderItem={(item: string, index: number, isSelected: boolean) => (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            )}
            {...dropdownProps}
          />
        )}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </Box>
  );
}
