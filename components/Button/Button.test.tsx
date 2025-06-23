import { render } from "@testing-library/react-native";
import { Button } from "./Button";

describe("Button", () => {
  test("Text renders correctly on Button", () => {
    const { getByText } = render(<Button variant="primary">Welcome!</Button>);

    getByText("Welcome!");
  });
  test("Button renders with correct variant styles", () => {
    const { getByTestId } = render(
      <Button variant="primary" testID="primary-button">
        Click Me
      </Button>,
    );
    const button = getByTestId("primary-button");

    expect(button.props.style).toEqual({
      alignItems: "center",
      backgroundColor: "#FFB700",
      borderRadius: 12,
      opacity: 1,
      padding: 12,
    });
  });
});
