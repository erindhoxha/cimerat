import { ActivityIndicator, StyleSheet } from 'react-native';
import { Box } from '../Box';

export const Loading = () => {
  return (
    <Box style={styles.container}>
      <ActivityIndicator />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
