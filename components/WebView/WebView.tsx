import { Platform } from 'react-native';
import { Box } from '../Box';

interface WebViewProps {
  children: React.ReactNode;
}

export const WebView: React.FC<WebViewProps> = ({ children }) => {
  const isWeb = Platform.OS === 'web';
  return (
    <Box
      style={
        isWeb && {
          maxWidth: 1028,
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          minHeight: '100%',
        }
      }
    >
      {children}
    </Box>
  );
};
