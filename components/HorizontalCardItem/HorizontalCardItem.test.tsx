import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { HorizontalCardItem } from "./HorizontalCardItem";

const mockRouter = { push: jest.fn() };

describe("HorizontalCardItem", () => {
  it("renders title and description", () => {
    const item = {
      id: "1",
      title: "Test Title",
      image: require("../../assets/images/apt.jpg"),
      description: "Test Description",
    };
    const { getByText } = render(<HorizontalCardItem item={item} router={mockRouter as any} />);
    expect(getByText("Test Title")).toBeTruthy();
    expect(getByText("Test Description")).toBeTruthy();
  });

  it("calls router.push on press", () => {
    const item = {
      id: "1",
      title: "Test Title",
      image: require("../../assets/images/apt.jpg"),
      description: "Test Description",
    };
    const { getByRole } = render(<HorizontalCardItem item={item} router={mockRouter as any} />);
    fireEvent.press(getByRole("button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/1");
  });
});
