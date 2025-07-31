import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { HorizontalCardItem } from "./HorizontalCardItem";

const mockRouter = {
  push: jest.fn(),
};

const mockItem = {
  id: "123",
  title: "Test Title",
  image: { uri: "https://example.com/image.jpg" },
  description: "This is a test description for the card.",
};

describe("HorizontalCardItem", () => {
  it("renders title and description", () => {
    const { getByText } = render(<HorizontalCardItem item={mockItem} router={mockRouter as any} />);
    expect(getByText("Test Title")).toBeTruthy();
    expect(getByText("This is a test description for the card.")).toBeTruthy();
  });

  it("calls router.push with correct id on press", () => {
    const { getByRole } = render(<HorizontalCardItem item={mockItem} router={mockRouter as any} />);
    fireEvent.press(getByRole("button"));
    expect(mockRouter.push).toHaveBeenCalledWith("/123");
  });

  it("renders the image with correct source", () => {
    const { getByRole } = render(<HorizontalCardItem item={mockItem} router={mockRouter as any} />);
    const image = getByRole("image");
    expect(image.props.source).toEqual({ uri: "https://example.com/image.jpg" });
  });

  it("renders empty description safely", () => {
    const { getByText } = render(
      <HorizontalCardItem item={{ ...mockItem, description: undefined }} router={mockRouter as any} />,
    );
    expect(getByText("No description available")).toBeTruthy();
  });
});
