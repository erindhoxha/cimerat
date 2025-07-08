import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { Box } from "../Box";
import { Text } from "../Text";
import { forwardRef } from "react";

const Input = forwardRef(
  (
    props: TextInputProps & {
      label?: string;
      required?: boolean;
    },
    ref: React.ForwardedRef<TextInput>,
  ) => {
    if (props.label) {
      return (
        <Box
          marginBottom={12}
          style={{
            gap: 6,
          }}>
          <Text>
            {props.label}
            {props.required ? (
              <Text
                style={{
                  color: Colors.light.danger,
                }}>
                *
              </Text>
            ) : (
              ""
            )}
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                height: props.multiline ? 100 : "auto",
              },
            ]}
            {...props}
            ref={ref}
          />
        </Box>
      );
    }
    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            height: props.multiline ? 100 : "auto",
          },
        ]}
        {...props}
        keyboardAppearance="light"
        placeholderTextColor={Colors.light.gray}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.gray,
    borderRadius: 12,
  },
});

export default Input;
