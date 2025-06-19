import { FontSizes } from "@/constants/FontSizes";
import { FontWeights } from "@/constants/FontWeights";
import { Text as DefaultText, TextProps } from "react-native";

interface TxtProps extends TextProps {
  fontSize?: keyof typeof FontSizes;
  fontWeight?: keyof typeof FontWeights;
}

export function Text(props: TxtProps) {
  const { style, ...otherProps } = props;
  return (
    <DefaultText
      style={[
        {
          fontSize: FontSizes[props.fontSize as keyof typeof FontSizes],
          fontWeight: FontWeights[props.fontWeight as keyof typeof FontWeights],
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
