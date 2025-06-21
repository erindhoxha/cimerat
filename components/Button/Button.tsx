import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Text } from "../Text";
import Colors from "@/constants/Colors";

export const Button = (
  props: TouchableOpacityProps & {
    variant?: "primary" | "secondary";
  },
) => {
  return (
    <TouchableOpacity
      style={[props.variant === "primary" ? style.primaryButton : style.secondaryButton, props.style]}
      {...props}>
      <Text fontWeight="medium">{props.children}</Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.light.yellow,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: Colors.light.gray,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
});
