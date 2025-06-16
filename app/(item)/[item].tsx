import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function ItemDetailScreen() {
  const { item } = useLocalSearchParams();

  return (
    <View style={{ flex: 1 }}>
      <Image
        style={styles.cardImage}
        source={require("../../assets/images/apt.jpg")}
        contentFit="cover"
        placeholder={{
          blurhash,
        }}
        transition={1000}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginVertical: 10 }}>Item {item}</Text>
        <Text>Item ID: {item}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardImage: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },
});
