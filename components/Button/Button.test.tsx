import { render } from "@testing-library/react-native";
import { Button } from "./Button";

describe("Button", () => {
  test("Text renders correctly on Button", () => {
    const { getByText } = render(<Button variant="primary">Welcome!</Button>);

    getByText("Welcome!");
  });
});
