import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Input from "./Input";

describe("Input", () => {
  it("renders a basic input without label", () => {
    const { getByPlaceholderText } = render(<Input placeholder="Type here" />);
    expect(getByPlaceholderText("Type here")).toBeTruthy();
  });

  it("renders a labeled input", () => {
    const { getByText } = render(<Input label="My Label" />);
    expect(getByText("My Label")).toBeTruthy();
  });

  it("shows required asterisk when required", () => {
    const { getByText } = render(<Input label="Name" required />);
    expect(getByText("*")).toBeTruthy();
  });

  it("shows error message", () => {
    const { getByText } = render(<Input error="This is an error" />);
    expect(getByText("This is an error")).toBeTruthy();
  });

  it("renders multiline input with correct style", () => {
    const { getByTestId } = render(<Input multiline testID="multiline-input" />);
    const input = getByTestId("multiline-input");
    expect(input.props.multiline).toBe(true);
  });

  it("calls onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(<Input placeholder="Type here" onChangeText={onChangeText} />);
    fireEvent.changeText(getByPlaceholderText("Type here"), "New text");
    expect(onChangeText).toHaveBeenCalledWith("New text");
  });
});
