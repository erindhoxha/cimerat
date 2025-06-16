import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { HorizontalCardItem } from "@/components/HorizontalCardItem";

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
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Listimet tua</Text>
        <TouchableOpacity
          onPress={() => {
            router.push("/create");
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
            shadowOpacity: 0.12,
            shadowRadius: 3.84,
          }}>
          <Text style={{ color: "#000", fontSize: 14 }}>Krijo një listim të ri</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} lightColor="#eee" />
      <Text style={styles.emptyText}>
        Nuk keni asnjë listim të krijuar. Shtoni një listim të ri duke klikuar në butonin "Krijo" në skedën e sipërme.
      </Text>
      {cardItems.map((item) => (
        <HorizontalCardItem item={item} router={router} key={item.id} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  emptyText: {
    marginTop: 10,
    marginBottom: 24,
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
