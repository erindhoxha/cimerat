import React from 'react';
import { View, ViewProps, StyleProp, ViewStyle } from 'react-native';

type BoxProps = ViewProps & {
  marginTop?: number | 'auto';
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  alignItems?: ViewStyle['alignItems'];
  justifyContent?: ViewStyle['justifyContent'];
  flexDirection?: ViewStyle['flexDirection'];
  flex?: number;
  backgroundColor?: string;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  gap?: number;
  alignSelf?: ViewStyle['alignSelf'];
  children?: React.ReactNode;
};

export default function Box({
  style,
  children,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  marginHorizontal,
  marginVertical,
  padding,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingHorizontal,
  paddingVertical,
  alignItems,
  justifyContent,
  flexDirection,
  flex,
  backgroundColor,
  borderRadius,
  gap,
  alignSelf,
  ...rest
}: BoxProps) {
  return (
    <View
      style={[
        {
          marginTop,
          marginBottom,
          marginLeft,
          marginRight,
          marginHorizontal,
          marginVertical,
          padding,
          paddingTop,
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingHorizontal,
          paddingVertical,
          alignItems,
          justifyContent,
          flexDirection,
          flex,
          backgroundColor,
          borderRadius,
          gap,
          alignSelf,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
