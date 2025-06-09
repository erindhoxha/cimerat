import { FlatList, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { Link } from "expo-router";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Prishtinë, Dardani, 2+1",
    description: "Banesë per qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu",
    price: "250€ për muaj",
    image: require("../../assets/images/apt.jpg"),
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    description: "Banesë për qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu",
    price: "350€ për muaj",
    image: require("../../assets/images/apt2.jpg"),
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    description: "Banesë për qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu",
    price: "400€ per muaj",
    image: require("../../assets/images/apt3.jpg"),
  },
];

type ItemProps = { title: string; image: string; description?: string; price?: string; id: string };

const Item = ({ title, image, description, price, id }: ItemProps) => (
  <Link href={`/${id}`} style={{ marginBottom: 20 }}>
    <View style={styles.card}>
      <Image style={styles.image} source={image} placeholder={{ blurhash }} contentFit="cover" transition={1000} />
      <View style={styles.cardContent}>
        <View style={styles.topCardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text ellipsizeMode="tail" numberOfLines={2}>
            {description}
          </Text>
        </View>
        <View>
          <Text style={styles.cardPrice}>{price}</Text>
        </View>
      </View>
    </View>
  </Link>
);

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 80,
        }}
        ListHeaderComponent={() => (
          <View style={styles.pillMainText}>
            <Text>Listimet në </Text>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Prishtinë</Text>
            </View>
          </View>
        )}
        style={{
          padding: 0,
          margin: 0,
        }}
        data={DATA}
        renderItem={({ item }) => (
          <Item id={item.id} title={item.title} image={item.image} description={item.description} price={item.price} />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "light",
  },
  card: {
    marginVertical: 16,
  },
  topCardContent: {
    flexDirection: "column",
    justifyContent: "space-between",
    width: "70%",
  },
  pill: {
    backgroundColor: "#0553",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: "bold",
  },
  pillMainText: {
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "light",
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 14,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: "light",
    color: "#666",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  image: {
    flex: 1,
    backgroundColor: "#0553",
    height: 200,
    width: "100%",
    borderRadius: 10,
  },
});
