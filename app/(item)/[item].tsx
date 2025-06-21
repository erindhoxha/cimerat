import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "@/components/Text";
import { Box } from "@/components/Box";
import Colors from "@/constants/Colors";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ItemDetailScreen() {
  const { item } = useLocalSearchParams();

  return (
    <Box style={{ flex: 1 }}>
      <Image
        style={styles.cardImage}
        source={require("../../assets/images/apt.jpg")}
        contentFit="cover"
        placeholder={{
          blurhash,
        }}
        transition={1000}
      />
      <Box flex={1} style={{ paddingHorizontal: 24, height: "auto" }}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          style={{
            alignItems: "flex-start",
          }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>Titulli {item}</Text>
          <Box
            flexDirection="row"
            alignItems="center"
            paddingHorizontal={8}
            paddingVertical={4}
            style={{
              gap: 12,
              borderWidth: 1,
              borderColor: Colors.light.gray,
              borderRadius: 24,
            }}>
            <Box
              flexDirection="row"
              alignItems="center"
              style={{
                gap: 4,
              }}>
              <Text fontSize="md">4</Text>
              <FontAwesome name="user-o" size={14} color="black" />
            </Box>
            <Text>250€</Text>
          </Box>
        </Box>

        <Text>Item ID: {item}</Text>
        <Text style={{ marginTop: 10 }}>
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
});
