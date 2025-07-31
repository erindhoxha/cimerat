import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ImagePreviewModal } from "./ImagePreviewModal";

describe("ImagePreviewModal", () => {
  it("renders nothing when not visible", () => {
    const { queryByTestId } = render(
      <ImagePreviewModal visible={false} uri="https://example.com/img.jpg" onClose={jest.fn()} />,
    );
    // Modal is not rendered when visible is false
    expect(queryByTestId("image-preview-overlay")).toBeNull();
  });

  it("renders overlay and image when visible and uri is provided", () => {
    const { getByTestId, getByRole } = render(
      <ImagePreviewModal visible={true} uri="https://example.com/img.jpg" onClose={jest.fn()} />,
    );
    expect(getByTestId("image-preview-overlay")).toBeTruthy();
    expect(getByRole("image")).toBeTruthy();
  });

  it("does not render image if uri is null", () => {
    const { getByTestId, queryByRole } = render(<ImagePreviewModal visible={true} uri={null} onClose={jest.fn()} />);
    expect(getByTestId("image-preview-overlay")).toBeTruthy();
    expect(queryByRole("image")).toBeNull();
  });

  it("calls onClose when overlay is pressed", () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <ImagePreviewModal visible={true} uri="https://example.com/img.jpg" onClose={onClose} />,
    );
    fireEvent.press(getByTestId("image-preview-overlay"));
    expect(onClose).toHaveBeenCalled();
  });
});
