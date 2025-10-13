import { Box } from '../Box';

interface WebViewProps {
  children: React.ReactNode;
  noPadding?: boolean;
}

export const WebView: React.FC<WebViewProps> = ({ children, noPadding = false }) => {
  return (
    <Box
      style={{
        backgroundColor: 'white',
        padding: noPadding ? 0 : 20,
        flex: 1,
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
};
