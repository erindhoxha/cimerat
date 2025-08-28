import { ActivityIndicator, StyleSheet } from 'react-native';
import { Box } from '../Box';
import { Text } from '../Text';
import { WebView } from '../WebView/WebView';

interface LoadingProps {
  title?: string;
}

export const Loading: React.FC<LoadingProps> = ({ title }) => {
  return (
    <WebView>
      <Box style={styles.container}>
        <ActivityIndicator />
        <Text>{title || 'Duke ngarkuar...'}</Text>
      </Box>
    </WebView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 12,
  },
});
