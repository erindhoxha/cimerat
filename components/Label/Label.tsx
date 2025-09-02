import { Box } from '../Box';
import { Text } from '../Text';

interface LabelProps {
  children: React.ReactNode;
}

const Label = ({ children }: LabelProps) => {
  return (
    <Box marginBottom={6}>
      <Text
        style={{
          fontSize: 14,
        }}
      >
        {children}
      </Text>
    </Box>
  );
};

export default Label;
