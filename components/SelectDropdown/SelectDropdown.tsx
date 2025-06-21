import { StyleSheet } from "react-native";
import { View } from "../View/View";
import { FontAwesome } from "@expo/vector-icons";
import SelectDropdown, { SelectDropdownProps } from "react-native-select-dropdown";
import { Text } from "../Text";
import Label from "../Label";
import { Box } from "../Box";

interface SelectOmittedProps extends Omit<SelectDropdownProps, "onSelect" | "renderButton" | "renderItem"> {}

interface SelectProps extends SelectOmittedProps {
  placeholder?: string;
  label: string;
  onSelect: (selectedItem: string, index: number) => void;
}

export const SelectDropdownComponent = ({ placeholder, label, onSelect, ...props }: SelectProps) => {
  return (
    <View>
      <Label>{label}</Label>
      <Box
        flex={1}
        flexDirection="row"
        gap={12}
        style={{
          maxWidth: "100%",
        }}>
        <SelectDropdown
          {...props}
          onSelect={(selectedItem, index) => {
            onSelect(selectedItem, index);
          }}
          renderButton={(_: string, isOpened: boolean) => {
            // Apply a different style if disabled
            return (
              <Box style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{placeholder || ""}</Text>
                <Text>
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                </Text>
              </Box>
            );
          }}
          renderItem={(item: any, _: number, isSelected: boolean) => {
            return (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </Box>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    marginBottom: 12,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 1,
  },
  dropdownButtonStyleFull: {
    width: "100%",
    height: 50,
    marginBottom: 12,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemStyle: {
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
});
