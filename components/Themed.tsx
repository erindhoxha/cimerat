/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView } from "react-native";

import Colors from "@/constants/Colors";
import { FontSizes } from "@/constants/FontSizes";
import { FontWeights } from "@/constants/FontWeights";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  fontSize?: "sm" | "md" | "lg" | "xl" | "xxl";
  fontWeight?: "light" | "regular" | "medium" | "semibold" | "bold" | "extrabold" | "black";
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return (
    <DefaultText
      style={[
        {
          color,
          fontSize: FontSizes[props.fontSize as keyof typeof FontSizes],
          fontWeight: FontWeights[props.fontWeight as keyof typeof FontWeights],
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
