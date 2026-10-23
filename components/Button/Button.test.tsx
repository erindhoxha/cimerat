import { render } from '@testing-library/react-native';
import { Button } from './Button';
import Colors from '@/constants/Colors';

describe('Button', () => {
  test('Text renders correctly on Button', () => {
    const { getByText } = render(<Button>Welcome!</Button>);

    getByText('Welcome!');
  });
  test('Button renders with correct variant styles', () => {
    const { getByTestId } = render(<Button testID="primary-button">Click Me</Button>);
    const button = getByTestId('primary-button');

    expect(button.props.style).toEqual(
      expect.objectContaining({
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 12,
      }),
    );
  });
});
