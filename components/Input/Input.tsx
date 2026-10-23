import Colors from '@/constants/Colors';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { Box } from '../Box';
import { Text } from '../Text';
import { forwardRef } from 'react';

const Input = forwardRef(
  (
    props: TextInputProps & {
      label?: string;
      required?: boolean;
      error?: string;
    },
    ref: React.ForwardedRef<TextInput>,
  ) => {
    if (props.label) {
      return (
        <Box style={styles.labeledBox}>
          <Text style={styles.label}>
            {props.label}
            {props.required ? <Text style={styles.required}>*</Text> : ''}
          </Text>
          <TextInput
            collapsable
            multiline={props.multiline}
            placeholderTextColor={Colors.gray}
            style={[
              styles.input,
              props.multiline ? styles.inputMultiline : null,
              props.error ? styles.inputError : null,
            ]}
            {...props}
            ref={ref}
          />
          {props.error && <Text style={styles.error}>{props.error}</Text>}
        </Box>
      );
    }
    return (
      <>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            props.multiline ? styles.inputMultilineSmall : null,
            props.error ? styles.inputError : null,
          ]}
          {...props}
          keyboardAppearance="light"
          placeholderTextColor={Colors.gray}
        />
        {props.error && <Text style={styles.error}>{props.error}</Text>}
      </>
    );
  },
);

const styles = StyleSheet.create({
  labeledBox: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textFade,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  required: {
    color: Colors.danger,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.text,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    outlineColor: Colors.primary,
  },
  inputMultiline: {
    height: 200,
    textAlignVertical: 'top',
  },
  inputMultilineSmall: {
    height: 100,
    textAlignVertical: 'top',
  },
  error: {
    color: Colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
