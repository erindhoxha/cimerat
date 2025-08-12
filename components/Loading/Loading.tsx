import { ActivityIndicator, StyleSheet } from 'react-native';
import { Box } from '../Box';
import { Text } from '../Text';

export const Loading = () => {
  return (
    <Box style={styles.container}>
      <ActivityIndicator />
      <Text>Loading...</Text>
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
