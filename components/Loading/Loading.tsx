import { ActivityIndicator, StyleSheet } from 'react-native';
import { Box } from '../Box';
import { Text } from '../Text';

interface LoadingProps {
  title?: string;
}

export const Loading: React.FC<LoadingProps> = ({ title }) => {
  return (
    <Box style={styles.container}>
      <ActivityIndicator />
      <Text>{title || 'Duke ngarkuar...'}</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff',
    gap: 12,
  },
});
