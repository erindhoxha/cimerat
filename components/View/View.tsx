import { View as DefaultView } from "react-native";

export type ViewProps = DefaultView["props"];

export function View(props: ViewProps) {
  const { style, ...otherProps } = props;

  return <DefaultView style={[{ backgroundColor: "white" }, style]} {...otherProps} />;
}
