import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text } from "@/components/Text";
import { Box } from "@/components/Box";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ItemDetailScreen() {
  const { item } = useLocalSearchParams();

  return (
    <Box flex={1} style={styles.container}>
      <Image
        style={styles.cardImage}
        source={{
          uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/87d1ce538b289332d56de223aa4d2227`,
        }}
        contentFit="cover"
        placeholder={{
          blurhash,
        }}
        transition={1000}
      />
      <Box flex={1} paddingHorizontal={20}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start">
          <Text fontSize="xl" fontWeight="bold" style={{ flexShrink: 1 }}>
            Titulli {item}
          </Text>
        </Box>
        <Text>Item ID: {item}</Text>
        <Text>
          This is a detailed view of item {item}. Here you can add more information about the item, including
          descriptions, features, and other relevant details.
        </Text>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  cardImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
});
