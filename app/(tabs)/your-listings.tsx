import { ScrollView, StyleSheet } from "react-native";
import { View } from "@/components/View/View";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { HorizontalCardItem } from "@/components/HorizontalCardItem/HorizontalCardItem";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button/Button";
import { Box } from "@/components/Box";

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
      <Box gap={12}>
        <Text fontSize="xl" fontWeight="bold">
          Listimet tua
        </Text>
        <Link href="/create" asChild>
          <Button variant="primary">
            <Text>Krijo një listim të ri</Text>
          </Button>
        </Link>
      </Box>
      <View style={styles.separator} />
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
    padding: 20,
    backgroundColor: "#fff",
  },
  emptyText: {
    marginTop: 10,
    marginBottom: 24,
  },
  separator: {
    marginBottom: 12,
    marginTop: 24,
    height: 1,
    width: "100%",
    backgroundColor: Colors.light.gray,
  },
});
