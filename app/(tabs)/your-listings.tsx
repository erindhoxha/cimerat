import { ScrollView, StyleSheet } from "react-native";
import { View } from "@/components/View/View";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { HorizontalCardItem } from "@/components/HorizontalCardItem/HorizontalCardItem";
import { Text } from "@/components/Text";
import { Button } from "@/components/Button/Button";
import { Box } from "@/components/Box";
import { useAuth } from "@/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Listing } from "@/types";

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
  const { token } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!token;

  const listings = useQuery<Listing[]>({
    staleTime: 0,
    queryKey: ["my-listings"],
    queryFn: async () => {
      const params = new URLSearchParams();
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/my-listings?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch listings");
      }
      return res.json();
    },
  });

  const { data } = listings;

  return (
    <ScrollView style={styles.container}>
      {isLoggedIn && (
        <Box gap={12}>
          <Text fontSize="xl" fontWeight="bold">
            Listimet e mia
          </Text>
          <Link href="/create" asChild>
            <Button variant="primary">
              <Text>Krijo një listim të ri</Text>
            </Button>
          </Link>
        </Box>
      )}
      {!isLoggedIn && (
        <Box marginTop={24} gap={12} style={styles.centeredBox}>
          <Box>
            <FontAwesome name="exclamation" size={48} color={Colors.light.danger} />
          </Box>
          <Text fontSize="xl" fontWeight="bold">
            Oh, jo! Nuk jeni të kyçur
          </Text>
          <Text>Ju lutemi, kyçuni për të parë listimet tuaja.</Text>
          <Link href="/login" asChild>
            <Button variant="primary" style={styles.fullWidthButton}>
              <Text>Kyçu</Text>
            </Button>
          </Link>
        </Box>
      )}
      {isLoggedIn && (
        <>
          <View style={styles.separator} />
          {!!data?.length ? (
            data.map((item) => <HorizontalCardItem item={item} router={router} key={item.id} />)
          ) : (
            <Text style={styles.emptyText}>
              Nuk keni asnjë listim të krijuar. Shtoni një listim të ri duke klikuar në butonin "Krijo" në skedën e
              sipërme.
            </Text>
          )}
        </>
      )}
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
  centeredBox: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  fullWidthButton: {
    width: "100%",
  },
});
