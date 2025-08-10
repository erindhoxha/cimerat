import { render } from '@testing-library/react-native';
import { Pill } from './Pill';
import Colors from '@/constants/Colors';
import { Text } from '../Text';

describe('Pill', () => {
  it('renders with default yellow variant', () => {
    const { getByText } = render(<Pill title="Test Pill" />);
    const pillText = getByText('Test Pill');
    expect(pillText).toBeTruthy();
  });

  it('renders with green variant', () => {
    const { getByText, getByTestId } = render(<Pill title="Green Pill" variant="green" />);
    expect(getByText('Green Pill')).toBeTruthy();
  });

  it('renders iconLeft if provided', () => {
    const Icon = () => <Text testID="icon">Icon</Text>;
    const { getByTestId } = render(<Pill title="Icon Pill" iconLeft={<Icon />} />);
    expect(getByTestId('icon')).toBeTruthy();
  });

  it('applies correct background color for yellow variant', () => {
    const { getByTestId } = render(<Pill title="Yellow Pill" variant="yellow" />);
    const pillBox = getByTestId('pill-box');
    expect(pillBox.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: Colors.yellow })]),
    );
  });

  it('applies correct background color for green variant', () => {
    const { getByTestId } = render(<Pill title="Green Pill" variant="green" />);
    const pillBox = getByTestId('pill-box');
    expect(pillBox.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ backgroundColor: Colors.green })]),
    );
  });
});
