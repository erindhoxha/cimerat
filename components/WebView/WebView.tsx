import { Platform, useWindowDimensions } from 'react-native';
import { Box } from '../Box';

interface WebViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const WebView: React.FC<WebViewProps> = ({ children, noPadding = false }) => {
  const isWeb = Platform.OS === 'web';
  const { width } = useWindowDimensions();
  return (
    <Box
      style={
        isWeb && {
          maxWidth: 1028,
          width: '100%',
          paddingHorizontal: width > 1028 && !noPadding ? 20 : 0,
          paddingBottom: 20,
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
