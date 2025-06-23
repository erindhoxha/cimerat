import { render } from "@testing-library/react-native";
import { CardItem } from "./CardItem";

describe("CardItem", () => {
  render(
    <CardItem
      title="Test Item"
      image="https://example.com/image.jpg"
      description="This is a test item description."
      price="$100"
      id="1"
      date="2023-10-01"
    />,
  );

  test("renders title correctly", () => {
    const { getByText } = render(
      <CardItem
        title="Test Item"
        image="https://example.com/image.jpg"
        description="This is a test item description."
        price="$100"
        id="1"
        date="2023-10-01"
      />,
    );
    getByText("Test Item");
  });
});
