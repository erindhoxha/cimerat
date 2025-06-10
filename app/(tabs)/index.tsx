import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { Link } from "expo-router";
import SelectDropdown from "react-native-select-dropdown";
import { useRef, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "Prishtinë, Dardani, 2+1",
    description: "Banesë per qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu",
    price: "250€ për muaj",
    image: require("../../assets/images/apt.jpg"),
    date: "10/06/2025",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
    description: "Banesë për qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu",
    price: "350€ për muaj",
    image: require("../../assets/images/apt2.jpg"),
    date: "10/06/2025",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
    description: "Banesë për qira në Dardani, i ka të gjitha pajisjet e nevojshme, 2 cimera jane qe jetojne ketu",
    price: "400€ per muaj",
    image: require("../../assets/images/apt3.jpg"),
    date: "10/06/2025",
  },
];

const cities = [
  "Prishtina",
  "Peja",
  "Mitrovica",
  "Ferizaj",
  "Gjakova",
  "Gjilan",
  "Vushtrri",
  "Shtime",
  "Obiliq",
  "Lipjan",
  "Fushë Kosovë",
  "Drenas",
  "Kaçanik",
  "Dragash",
  "Klinë",
  "Deçan",
  "Istog",
  "Rahovec",
  "Suhareke",
];

type ItemProps = { title: string; image: string; description?: string; price?: string; id: string; date: string };

const Item = ({ title, image, description, price, id, date }: ItemProps) => (
  <Link href={`/${id}`} style={{ marginBottom: 20, width: "100%", flex: 1 }}>
    <View style={styles.card}>
      <Image style={styles.image} source={image} placeholder={{ blurhash }} contentFit="cover" transition={1000} />
      <View style={styles.cardContent}>
        <View style={styles.topCardContent}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text ellipsizeMode="tail" numberOfLines={2}>
            {description}
          </Text>
          <Text style={styles.cardPrice}>{price}</Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexDirection: "column",
            flex: 1,
            height: "auto",
          }}>
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
  </Link>
);

export default function TabOneScreen() {
  const [disabled, setDisabled] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);

  const cityRef = useRef<SelectDropdown>(null);
  const neighborHoodRef = useRef<SelectDropdown>(null);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 80,
        }}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexShrink: 1,
                flexDirection: "row",
                gap: 12,
                maxWidth: "100%",
              }}>
              <SelectDropdown
                data={cities}
                onSelect={(selectedItem, index) => {
                  setDisabled(false);
                  setSelectedCity(selectedItem);
                }}
                ref={cityRef}
                renderButton={(_, isOpened) => {
                  console.log(isOpened);
                  // Apply a different style if disabled
                  return (
                    <View style={[styles.dropdownButtonStyle]}>
                      <Text style={[styles.dropdownButtonTxtStyle]}>{selectedCity || "Zgjedh Qytetin"}</Text>
                      <Text>
                        <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                      </Text>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />

              <SelectDropdown
                data={cities}
                disabled={disabled}
                ref={neighborHoodRef}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  setSelectedNeighborhood(selectedItem);
                }}
                renderButton={(_, isOpened) => {
                  // Apply a different style if disabled
                  return (
                    <View
                      style={[
                        styles.dropdownButtonStyle,
                        disabled ? styles.dropdownButtonDisabledStyle : null, // add this style
                      ]}>
                      <Text
                        style={[
                          styles.dropdownButtonTxtStyle,
                          disabled ? styles.dropdownButtonTxtDisabledStyle : null, // add this style
                        ]}>
                        {selectedNeighborhood || "Zgjedh lagjen"}
                      </Text>
                      <Text>
                        <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                      </Text>
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                      <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
                    </View>
                  );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
              />
            </View>
            {selectedCity && selectedNeighborhood && (
              <View style={styles.pillMainText}>
                <Text>Listimet në </Text>
                <TouchableOpacity
                  style={styles.pill}
                  onPress={() => {
                    cityRef.current?.openDropdown();
                  }}>
                  <Text style={styles.pillText}>{selectedCity}</Text>
                </TouchableOpacity>
                <Text>, </Text>
                <TouchableOpacity
                  style={styles.pill}
                  onPress={() => {
                    neighborHoodRef.current?.openDropdown();
                  }}>
                  <Text style={styles.pillText}>{selectedNeighborhood}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
        style={{
          padding: 0,
          margin: 0,
        }}
        data={DATA}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            title={item.title}
            image={item.image}
            description={item.description}
            price={item.price}
            date={item.date}
          />
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "light",
  },
  card: {
    marginVertical: 16,
    width: "100%",
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
    marginTop: 6,
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
  dropdownButtonStyle: {
    width: "50%",
    height: 50,
    marginBottom: 12,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 1,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonDisabledStyle: {
    backgroundColor: "#e0e0e0",
    opacity: 0.6,
  },
  dropdownButtonTxtDisabledStyle: {
    color: "#aaa",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
  },
});
