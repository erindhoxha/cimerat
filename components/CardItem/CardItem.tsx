import { useRouter } from "expo-router";
import { Text, View } from "../Themed";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ItemProps {
  title: string;
  image: string;
  description?: string;
  price?: string;
  id: string;
  date: string;
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const CardItem = ({ title, image, description, price, id, date }: ItemProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.cardLink} onPress={() => router.push(`/${id}`)}>
      <View style={styles.card}>
        <Image
          style={styles.cardImage}
          source={image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <View style={styles.topCardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text ellipsizeMode="tail" numberOfLines={2}>
              {description}
            </Text>
            <Text style={styles.cardPrice}>{price}</Text>
          </View>
          <View style={styles.cardInnerContent}>
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={{
                marginBottom: 6,
              }}>
              {date}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 16,
    width: "100%",
  },
  cardLink: {
    marginBottom: 20,
    width: "100%",
    flex: 1,
  },
  cardInnerContent: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "column",
    flex: 1,
    height: "auto",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cardImage: {
    flex: 1,
    backgroundColor: "#0553",
    height: 200,
    width: "100%",
    borderRadius: 10,
  },
  topCardContent: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "70%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "light",
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    marginTop: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "light",
    color: "#666",
  },
});
