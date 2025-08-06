import { useRouter } from "expo-router";
import { View } from "../View/View";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "../Text";

interface ItemProps {
  title: string;
  images: string;
  description?: string;
  price?: string;
  id: string;
  date: string;
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export const CardItem = ({ title, images, description, price, id, date }: ItemProps) => {
  const router = useRouter();
  console.log(images);
  return (
    <TouchableOpacity style={styles.cardLink} onPress={() => router.push(`/${id}`)}>
      <View style={styles.card}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${process.env.EXPO_PUBLIC_API_URL}${images[0]}`,
          }}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <View style={styles.topCardContent}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle} ellipsizeMode="tail" numberOfLines={2}>
              {description}
            </Text>
            <Text style={styles.cardPrice}>{price}€ për muaj</Text>
          </View>
          <View style={styles.cardInnerContent}>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.cardDate}>
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
  cardDate: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "400",
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
    fontWeight: "500",
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
    marginTop: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
});
