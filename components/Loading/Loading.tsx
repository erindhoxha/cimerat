import { StyleSheet } from 'react-native';
import { Box } from '../Box';
import { Text } from '../Text';

export const Loading = () => {
  return (
    <Box style={styles.container}>
      <Text>Duke ngarkuar...</Text>
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
