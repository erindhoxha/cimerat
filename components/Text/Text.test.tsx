import React from "react";
import { render } from "@testing-library/react-native";
import { Text } from "./Text";

// Mock FontSizes and FontWeights for testing
jest.mock("@/constants/FontSizes", () => ({
  FontSizes: { sm: 12, md: 16, xl: 24 },
}));
jest.mock("@/constants/FontWeights", () => ({
  FontWeights: { normal: "400", bold: "700" },
}));

describe("Text", () => {
  it("renders children", () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText("Hello World")).toBeTruthy();
  });

  it("applies fontSize and fontWeight from props", () => {
    const { getByText } = render(
      <Text fontSize="xl" fontWeight="bold">
        Styled Text
      </Text>,
    );
    const text = getByText("Styled Text");
    // The style prop is an array, flatten it for easier assertions
    const style = Array.isArray(text.props.style) ? Object.assign({}, ...text.props.style) : text.props.style;
    expect(style.fontSize).toBe(24);
    expect(style.fontWeight).toBe("700");
  });

  it("merges custom style prop", () => {
    const { getByText } = render(<Text style={{ color: "red" }}>Custom Style</Text>);
    const text = getByText("Custom Style");
    const style = Array.isArray(text.props.style) ? Object.assign({}, ...text.props.style) : text.props.style;
    expect(style.color).toBe("red");
  });

  it("renders with default fontSize and fontWeight if not provided", () => {
    const { getByText } = render(<Text>Default Style</Text>);
    const text = getByText("Default Style");
    const style = Array.isArray(text.props.style) ? Object.assign({}, ...text.props.style) : text.props.style;
    // Should be undefined if not provided
    expect(style.fontSize).toBeUndefined();
    expect(style.fontWeight).toBeUndefined();
  });
});
