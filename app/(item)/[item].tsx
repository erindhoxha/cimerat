import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ItemDetailScreen() {
  const { item } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Item ID: {item}</Text>
    </View>
  );
}
