import { StyleSheet } from "react-native";
import { View } from "../View/View";
import { FontAwesome } from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import { Text } from "../Text";
import Label from "../Label";

interface SelectDropdownProps {
  options: string[];
  placeholder?: string;
  label: string;
  onSelect: (selectedItem: string, index: number) => void;
}

export const SelectDropdownComponent = ({ options, placeholder, label, onSelect }: SelectDropdownProps) => {
  return (
    <View>
      <Label>{label}</Label>
      <View
        style={{
          flexShrink: 1,
          flexDirection: "row",
          gap: 12,
          maxWidth: "100%",
        }}>
        <SelectDropdown
          data={options}
          onSelect={(selectedItem, index) => {
            onSelect(selectedItem, index);
          }}
          renderButton={(_: string, isOpened: boolean) => {
            // Apply a different style if disabled
            return (
              <View style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{placeholder || ""}</Text>
                <Text>
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                </Text>
              </View>
            );
          }}
          renderItem={(item: any, _: number, isSelected: boolean) => {
            return (
              <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </View>
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
