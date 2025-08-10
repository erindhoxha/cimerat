import Colors from '@/constants/Colors';
import { Box } from '../Box';
import { Text } from '../Text';

interface PillProps {
  title: string;
  variant?: 'yellow' | 'green';
  iconLeft?: React.ReactNode;
}

const VARIANTS = {
  yellow: {
    backgroundColor: Colors.yellow,
  },
  green: {
    backgroundColor: Colors.green,
  },
};

export const Pill: React.FC<PillProps> = ({ title, iconLeft, variant = 'yellow' }) => {
  return (
    <Box gap={4} flexDirection="row" borderRadius={12} paddingVertical={4} paddingHorizontal={8} {...VARIANTS[variant]}>
      {iconLeft}
      <Text>{title}</Text>
    </Box>
  );
};
