import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { AccordionView } from "./Accordion";
import { Text } from "../Text";
import { FontAwesome } from "@expo/vector-icons";

describe("AccordionView", () => {
  it("renders the accordion header", () => {
    const { getByText } = render(<AccordionView />);
    expect(getByText("Filtro më shumë")).toBeTruthy();
  });

  it("renders the FontAwesome chevron-down icon in header", () => {
    const { UNSAFE_getAllByType } = render(<AccordionView />);
    const icons = UNSAFE_getAllByType(FontAwesome);
    expect(icons.some((icon) => icon.props.name === "chevron-down")).toBe(true);
  });

  it("renders the dropdown button text", () => {
    const { getByText } = render(<AccordionView />);
    expect(getByText("Zgjedh Qytetin")).toBeTruthy();
  });

  it("renders the dropdown item", () => {
    const { getByText } = render(<AccordionView />);
    expect(getByText("City")).toBeTruthy();
  });

  it("renders the section content", () => {
    const { getByText } = render(<AccordionView />);
    expect(getByText("Lorem ipsum...asd")).toBeTruthy();
  });

  it("renders the dropdown chevron icon", () => {
    const { UNSAFE_getAllByType } = render(<AccordionView />);
    const icons = UNSAFE_getAllByType(FontAwesome);
    expect(icons.some((icon) => icon.props.name === "chevron-up" || icon.props.name === "chevron-down")).toBe(true);
  });
});
