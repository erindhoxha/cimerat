import React from "react";
import { render } from "@testing-library/react-native";
import Label from "./Label";
import { Text } from "../Text";

describe("Label", () => {
  it("renders children text", () => {
    const { getByText } = render(<Label>Hello World</Label>);
    expect(getByText("Hello World")).toBeTruthy();
  });

  it("renders children as React elements", () => {
    const { getByText } = render(
      <Label>
        <>{["Test", <Text key="1">Element</Text>]}</>
      </Label>,
    );
    expect(getByText("Test")).toBeTruthy();
    expect(getByText("Element")).toBeTruthy();
  });
});
