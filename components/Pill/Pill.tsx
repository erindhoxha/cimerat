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
    backgroundColor: Colors.accentSoft,
    color: Colors.accentInk,
  },
  green: {
    backgroundColor: Colors.greenSoft,
    color: Colors.green,
  },
};

export const Pill: React.FC<PillProps> = ({ title, iconLeft, variant = 'yellow' }) => {
  return (
    <Box
      testID="pill-box"
      gap={4}
      flexDirection="row"
      borderRadius={999}
      paddingVertical={4}
      alignItems="center"
      paddingHorizontal={10}
      backgroundColor={VARIANTS[variant].backgroundColor}
    >
      {iconLeft}
      <Text fontWeight="semibold" style={{ fontSize: 13, color: VARIANTS[variant].color }}>
        {title}
      </Text>
    </Box>
  );
};
