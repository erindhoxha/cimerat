import { StyleSheet, TextInput, TextInputProps } from "react-native";

const Input = (props: TextInputProps) => {
  return <TextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
  input: {
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
  },
});

export default Input;
