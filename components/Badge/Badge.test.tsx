import React from "react";
import { render } from "@testing-library/react-native";
import { Badge } from "./Badge";
import { FontAwesome } from "@expo/vector-icons";

describe("Badge", () => {
  it("renders the correct number of beds", () => {
    const { getByText } = render(<Badge />);
    expect(getByText("4")).toBeTruthy();
  });

  it("renders the euro price", () => {
    const { getByText } = render(<Badge />);
    expect(getByText("250")).toBeTruthy();
  });

  it("renders FontAwesome icons", () => {
    const { UNSAFE_getAllByType } = render(<Badge />);
    // Should render 1 bed, 2 user-o, 2 user, 1 euro = 6 icons
    const icons = UNSAFE_getAllByType(FontAwesome);
    expect(icons.length).toBe(6);
    // Check for specific icon names
    expect(icons.some((icon) => icon.props.name === "bed")).toBe(true);
    expect(icons.filter((icon) => icon.props.name === "user-o").length).toBe(2);
    expect(icons.filter((icon) => icon.props.name === "user").length).toBe(2);
    expect(icons.some((icon) => icon.props.name === "euro")).toBe(true);
  });

  it("applies the badge style", () => {
    const { getByTestId } = render(<Badge />);
    expect(getByTestId("badge-container")).toBeTruthy();
  });
});
