import React from "react";
import { render } from "@testing-library/react-native";
import { View } from "./View";
import { Text } from "react-native";

describe("View", () => {
  it("renders children", () => {
    const { getByText } = render(
      <View>
        <Text>Hello</Text>
      </View>,
    );
    expect(getByText("Hello")).toBeTruthy();
  });

  it("applies default backgroundColor", () => {
    const { getByTestId } = render(
      <View testID="custom-view">
        <Text>Test</Text>
      </View>,
    );
    const view = getByTestId("custom-view");
    const style = Array.isArray(view.props.style) ? Object.assign({}, ...view.props.style) : view.props.style;
    expect(style.backgroundColor).toBe("white");
  });

  it("merges custom style prop", () => {
    const { getByTestId } = render(
      <View testID="custom-view" style={{ backgroundColor: "red", padding: 10 }}>
        <Text>Styled</Text>
      </View>,
    );
    const view = getByTestId("custom-view");
    const style = Array.isArray(view.props.style) ? Object.assign({}, ...view.props.style) : view.props.style;
    expect(style.backgroundColor).toBe("red");
    expect(style.padding).toBe(10);
  });
});
