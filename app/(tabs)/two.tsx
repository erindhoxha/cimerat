import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";

export default function TabTwoScreen() {
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
      <View style={styles.listCard}>
        <Image
          style={styles.cardImage}
          source={require("../../assets/images/apt.jpg")}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Listimi 1</Text>
          <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores,
            voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At
            corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt
            quas! Atque nam minima totam laborum beatae placeat possimus!
          </Text>
        </View>
      </View>
      <View style={styles.listCard}>
        <Image
          style={styles.cardImage}
          source={require("../../assets/images/apt.jpg")}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Listimi 1</Text>
          <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores,
            voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At
            corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt
            quas! Atque nam minima totam laborum beatae placeat possimus!
          </Text>
        </View>
      </View>
      <View style={styles.listCard}>
        <Image
          style={styles.cardImage}
          source={require("../../assets/images/apt.jpg")}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Listimi 1</Text>
          <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores,
            voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At
            corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt
            quas! Atque nam minima totam laborum beatae placeat possimus!
          </Text>
        </View>
      </View>
      <View style={styles.listCard}>
        <Image
          style={styles.cardImage}
          source={require("../../assets/images/apt.jpg")}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Listimi 1</Text>
          <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores,
            voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At
            corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt
            quas! Atque nam minima totam laborum beatae placeat possimus!
          </Text>
        </View>
      </View>
      <View style={styles.listCard}>
        <Image
          style={styles.cardImage}
          source={require("../../assets/images/apt.jpg")}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Listimi 1</Text>
          <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores,
            voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At
            corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt
            quas! Atque nam minima totam laborum beatae placeat possimus!
          </Text>
        </View>
      </View>
      <View style={styles.listCard}>
        <Image
          style={styles.cardImage}
          source={require("../../assets/images/apt.jpg")}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Listimi 1</Text>
          <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores,
            voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At
            corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt
            quas! Atque nam minima totam laborum beatae placeat possimus!
          </Text>
        </View>
      </View>
      <View style={styles.listCard}>
        <Image
          style={styles.cardImage}
          source={require("../../assets/images/apt.jpg")}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Listimi 1</Text>
          <Text style={styles.cardDescription} ellipsizeMode="tail" numberOfLines={3}>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore cum esse itaque veritatis asperiores,
            voluptates non dolorum voluptatibus, nostrum aperiam illum sed laborum, repellendus nesciunt sequi. At
            corrupti quaerat sapiente eius nam reprehenderit consequuntur quibusdam consequatur quae fugiat? Ad a sunt
            quas! Atque nam minima totam laborum beatae placeat possimus!
          </Text>
        </View>
      </View>
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
