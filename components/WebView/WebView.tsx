import { Platform } from 'react-native';
import { Box } from '../Box';

interface WebViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const WebView: React.FC<WebViewProps> = ({ children, noPadding = false }) => {
  const isWeb = Platform.OS === 'web';
  return (
    <Box
      style={
        isWeb
          ? {
              maxWidth: 1028,
              backgroundColor: 'white',
              width: '100%',
              padding: noPadding ? 0 : 20,
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              alignSelf: 'stretch',
              height: '100%',
              paddingBottom: 24,
            }
          : {
              backgroundColor: 'white',
              padding: noPadding ? 0 : 20,
              flex: 1,
              width: '100%',
            }
      }
    >
      {children}
    </Box>
  );
};
