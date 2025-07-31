import Colors from "@/constants/Colors";
import { Box } from "../Box";
import { Text } from "../Text";
import { FontAwesome } from "@expo/vector-icons";

export const Badge = () => {
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingHorizontal={8}
      paddingVertical={4}
      borderRadius={24}
      gap={12}
      style={{
        borderWidth: 1,
        borderColor: Colors.light.gray,
      }}>
      <Box flexDirection="row" alignItems="center" gap={4}>
        <Text>4</Text>
        <FontAwesome name="bed" size={12} />
      </Box>
      <Box
        flexDirection="row"
        alignItems="center"
        style={{
          gap: 4,
        }}>
        <FontAwesome name="user-o" size={10} />
        <FontAwesome name="user-o" size={10} />
        <FontAwesome name="user" size={12} />
        <FontAwesome name="user" size={12} />
      </Box>
      <Text>
        250 <FontAwesome name="euro" size={12} />
      </Text>
    </Box>
  );
};
