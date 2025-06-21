import React from "react";
import { render } from "@testing-library/react-native";
import Box from "../Box";
import { Text } from "react-native";

describe("Box", () => {
  it("renders children correctly", () => {
    const { getByText } = render(
      <Box marginTop={8} alignItems="center">
        <Text>Test Box</Text>
      </Box>,
    );
    expect(getByText("Test Box")).toBeTruthy();
  });

  it("applies style props", () => {
    const { getByTestId } = render(<Box marginTop={10} testID="box" />);
    const box = getByTestId("box");
    expect(box.props.style[0].marginTop).toBe(10);
  });
});
