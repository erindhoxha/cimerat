import React from "react";
import { render } from "@testing-library/react-native";
import Box from "./Box";
import { Text } from "react-native";

describe("Box", () => {
  it("renders children", () => {
    const { getByText } = render(
      <Box>
        <Text>Hello</Text>
      </Box>,
    );
    expect(getByText("Hello")).toBeTruthy();
  });

  it("applies style props correctly", () => {
    const { getByTestId } = render(
      <Box
        testID="box"
        marginTop={10}
        marginBottom={5}
        padding={8}
        alignItems="center"
        justifyContent="flex-end"
        flexDirection="row"
        backgroundColor="#123456"
        borderRadius={12}
        gap={4}>
        <Text>Styled</Text>
      </Box>,
    );
    const box = getByTestId("box");
    const style = Array.isArray(box.props.style) ? Object.assign({}, ...box.props.style) : box.props.style;
    expect(style.marginTop).toBe(10);
    expect(style.marginBottom).toBe(5);
    expect(style.padding).toBe(8);
    expect(style.alignItems).toBe("center");
    expect(style.justifyContent).toBe("flex-end");
    expect(style.flexDirection).toBe("row");
    expect(style.backgroundColor).toBe("#123456");
    expect(style.borderRadius).toBe(12);
    expect(style.gap).toBe(4);
  });

  it("merges custom style prop", () => {
    const { getByTestId } = render(
      <Box testID="box" style={{ backgroundColor: "red", padding: 20 }}>
        <Text>Custom Style</Text>
      </Box>,
    );
    const box = getByTestId("box");
    const style = Array.isArray(box.props.style) ? Object.assign({}, ...box.props.style) : box.props.style;
    expect(style.backgroundColor).toBe("red");
    expect(style.padding).toBe(20);
  });
});
