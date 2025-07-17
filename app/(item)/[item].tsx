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
    <Box flex={1} style={styles.container}>
      <Image
        style={styles.cardImage}
        source={require("../../assets/images/apt.jpg")}
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
        </Box>
        <Text
          style={{
            marginTop: 12,
          }}>
          Item ID: {item}
        </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
});
