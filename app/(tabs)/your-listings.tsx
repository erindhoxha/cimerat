import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const cardItems = [
  {
    id: "1",
    title: "Listimi 1",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores, voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt quas! Atque nam minima totam laborum beatae placeat possimus!",
    image: require("../../assets/images/apt.jpg"),
  },
  {
    id: "2",
    title: "Listimi 2",
    description:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores, voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt quas! Atque nam minima totam laborum beatae placeat possimus!",
    image: require("../../assets/images/apt.jpg"),
  },
];

export default function TabTwoScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, marginBottom: 0 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Listimet tua</Text>
        <TouchableOpacity
          onPress={() => {
            // Handle create listing action
          }}
          style={{
            backgroundColor: Colors.light.yellow,
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Text style={{ color: "#000", fontSize: 16 }}>Krijo një listim të ri</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={{ marginTop: 10, marginBottom: 24 }}>
        Nuk keni asnjë listim të krijuar. Shtoni një listim të ri duke klikuar në butonin "Krijo" në skedën e sipërme.
      </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {cardItems.map((item) => {
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.listCard}
            onPress={() => {
              router.push(`/${item.id}`);
            }}>
            <Image style={styles.cardImage} source={item.image} contentFit="cover" transition={1000} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
                {item.description}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    paddingLeft: 12,
    flexShrink: 1,
    maxWidth: "100%",
  },
  cardImage: {
    backgroundColor: "#0553",
    height: "100%",
    width: 100,
    borderRadius: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    flexShrink: 1,
    maxWidth: "100%",
    width: "100%",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  listCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    flexShrink: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 16,
  },
  separator: {
    marginBottom: 12,
    height: 1,
    width: "100%",
  },
});
