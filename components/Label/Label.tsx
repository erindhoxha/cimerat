import Colors from '@/constants/Colors';
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
          fontSize: 13,
          fontWeight: '600',
          color: Colors.textMuted,
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {children}
      </Text>
    </Box>
  );
};

export default Label;
