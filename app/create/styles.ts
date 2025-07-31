import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "white", gap: 12, paddingBottom: 64 },
  trash: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 9999,
    padding: 8,
    boxShadow: "0 2px 4px rgba(1,1,1,0.1)",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
