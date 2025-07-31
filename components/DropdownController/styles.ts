import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  dropdownContainerStyle: {
    marginBottom: 12,
  },
  asterisk: {
    color: "red",
  },
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
  },
  dropdownMenuStyle: {
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: "500",
    color: "#151E26",
  },
  searchInputStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownButtonDisabledStyle: {
    backgroundColor: "#e0e0e0",
    opacity: 0.6,
  },
  dropdownButtonTxtDisabledStyle: {
    color: "#aaa",
  },
  error: {
    color: Colors.light.danger,
    fontSize: 12,
  },
});
