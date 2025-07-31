import React from "react";
import { render } from "@testing-library/react-native";
import { SliderComponent } from "./Slider";

jest.mock("react-native-awesome-slider", () => ({
  Slider: ({ renderMark, steps }: any) => (
    <>
      <>{Array.from({ length: steps + 1 }).map((_, i) => renderMark({ index: i }))}</>
    </>
  ),
}));

jest.mock("react-native-reanimated", () => ({
  useSharedValue: (v: any) => ({ value: v }),
}));

describe("SliderComponent", () => {
  it("renders slider marks with correct labels", () => {
    const { getByText } = render(<SliderComponent />);
    expect(getByText("0€")).toBeTruthy();
    expect(getByText("10€")).toBeTruthy();
    expect(getByText("20€")).toBeTruthy();
    expect(getByText("30€")).toBeTruthy();
    expect(getByText("40€")).toBeTruthy();
  });

  it("renders the correct number of marks", () => {
    const { getAllByText } = render(<SliderComponent />);
    expect(getAllByText("€").length).toBe(5);
  });
});
