import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ImagePickerGrid } from "./ImagePickerGrid";

const mockImages = [
  { base64: "base64-1", uri: "https://example.com/1.jpg" },
  { base64: "base64-2", uri: "https://example.com/2.jpg" },
];

describe("ImagePickerGrid", () => {
  it("renders the pick button", () => {
    const { getByText } = render(
      <ImagePickerGrid images={[]} onPick={jest.fn()} onPreview={jest.fn()} onRemove={jest.fn()} />,
    );
    expect(getByText("Zgjidh foto")).toBeTruthy();
  });

  it("calls onPick when the button is pressed", () => {
    const onPick = jest.fn();
    const { getByText } = render(
      <ImagePickerGrid images={[]} onPick={onPick} onPreview={jest.fn()} onRemove={jest.fn()} />,
    );
    fireEvent.press(getByText("Zgjidh foto"));
    expect(onPick).toHaveBeenCalled();
  });

  it("renders all images", () => {
    const { getAllByRole } = render(
      <ImagePickerGrid images={mockImages} onPick={jest.fn()} onPreview={jest.fn()} onRemove={jest.fn()} />,
    );
    // Each image should have a role of "image"
    expect(getAllByRole("image").length).toBe(2);
  });

  it("calls onPreview with correct uri when image is pressed", () => {
    const onPreview = jest.fn();
    const { getAllByRole } = render(
      <ImagePickerGrid images={mockImages} onPick={jest.fn()} onPreview={onPreview} onRemove={jest.fn()} />,
    );
    const pressables = getAllByRole("button");
    fireEvent.press(pressables[1]);
    expect(onPreview).toHaveBeenCalledWith("https://example.com/2.jpg");
  });

  it("calls onRemove with correct index when trash icon is pressed", () => {
    const onRemove = jest.fn();
    const { UNSAFE_getAllByProps } = render(
      <ImagePickerGrid images={mockImages} onPick={jest.fn()} onPreview={jest.fn()} onRemove={onRemove} />,
    );
    // Find all trash icons by their name prop
    const trashIcons = UNSAFE_getAllByProps({ name: "trash" });
    fireEvent.press(trashIcons[0]);
    expect(onRemove).toHaveBeenCalledWith(0);
    fireEvent.press(trashIcons[1]);
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
