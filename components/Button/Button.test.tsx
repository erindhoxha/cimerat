import { render } from "@testing-library/react-native";
import { Button } from "./Button";

describe("<HomeScreen />", () => {
  test("Text renders correctly on HomeScreen", () => {
    const { getByText } = render(<Button variant="primary">Welcome!</Button>);

    getByText("Welcome!");
  });
});
