import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import DrawerExample from './Drawer';
import { Text } from '../Text';
import { Alert } from 'react-native';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    token: null,
    setAuth: jest.fn(),
  }),
}));

describe('DrawerExample', () => {
  it('does not render when not visible', () => {
    const { queryByText } = render(<DrawerExample open={false} onClose={jest.fn()} />);
    expect(queryByText('Faqja kryesore')).toBeNull();
  });

  it('renders when open is true', () => {
    const { getByText } = render(<DrawerExample open={true} onClose={jest.fn()} />);
    expect(getByText('Faqja kryesore')).toBeTruthy();
  });

  it('calls onClose when overlay is pressed', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(<DrawerExample open={true} onClose={onClose} />);
    // The overlay does not have a testID, so we use accessibilityRole
    const overlay = getByTestId('drawer-overlay');
    fireEvent.press(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it('renders register and login when not logged in', () => {
    const { getByText } = render(<DrawerExample open={true} onClose={jest.fn()} />);
    expect(getByText('Regjistrohu')).toBeTruthy();
    expect(getByText('Kyçu')).toBeTruthy();
  });

  it('renders logout when logged in', () => {
    jest.mock('../../context/AuthContext', () => ({
      useAuth: () => ({
        token: 'mock-token',
        setAuth: jest.fn(),
      }),
    }));
    const { getByText } = render(<DrawerExample open={true} onClose={jest.fn()} />);
    expect(getByText('Dil')).toBeTruthy();
  });

  it('calls Alert on logout press', () => {
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    jest.mock('../../context/AuthContext', () => ({
      useAuth: () => ({
        token: 'mock-token',
        setAuth: jest.fn(),
      }),
    }));
    const { getByText } = render(<DrawerExample open={true} onClose={jest.fn()} />);
    fireEvent.press(getByText('Dil'));
    expect(Alert.alert).toHaveBeenCalled();
  });
});
