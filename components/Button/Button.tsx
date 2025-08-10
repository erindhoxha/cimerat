import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

type Variant = 'primary' | 'secondary' | 'tertiary';

export const Button = (
  props: TouchableOpacityProps & {
    variant?: Variant;
  },
) => {
  const THEME: Record<
    Variant,
    {
      backgroundColor: string;
      borderRadius: number;
      alignItems: 'center';
      color?: string;
    }
  > = {
    primary: style.primaryButton,
    secondary: style.secondaryButton,
    tertiary: style.tertiaryButton,
  };

  return (
    <TouchableOpacity {...props} style={[THEME[props.variant || 'primary'], props.style]}>
      <Text
        fontWeight="medium"
        style={{
          color: THEME[props.variant || 'primary'].color,
        }}
      >
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.yellow,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: Colors.lightGray,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  tertiaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.gray,
    color: Colors.tint,
    padding: 12,
    borderRadius: 12,
    fontWeight: 400,
    alignItems: 'center',
  },
});
