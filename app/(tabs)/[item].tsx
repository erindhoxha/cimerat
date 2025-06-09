import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ItemDetailScreen() {
  const { item } = useLocalSearchParams();

  return (
    <View>
      <Text>Item ID: {item}</Text>
    </View>
  );
}
