import { Image } from "expo-image";
import { ImageSourcePropType, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "../View/View";
import { Router } from "expo-router";
import { Text } from "../Text";

interface HorizontalCardItemProps {
  item: {
    id: string;
    title: string;
    image: ImageSourcePropType;
    description?: string;
  };
  router: Router;
}

export const HorizontalCardItem = ({ item, router }: HorizontalCardItemProps) => {
  return (
    <TouchableOpacity
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
};

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
});
