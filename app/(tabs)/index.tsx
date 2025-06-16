import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "@/components/Themed";
import SelectDropdown from "react-native-select-dropdown";
import { useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { CardItem } from "@/components/CardItem";
import Collapsible from "react-native-collapsible";
import { AccordionView } from "@/components/Accordion";

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

const neighborhoods: { [key: string]: string[] } = {
  Prishtina: [
    "Ulpiana",
    "Dardania",
    "Bregu i Diellit",
    "Lakrishtë",
    "Arbëria",
    "Mati 1",
    "Mati 2",
    "Veternik",
    "Velania",
    "Qafa",
    "Qendra",
    "Kalabria",
    "Emshir",
    "Taslixhe",
    "Tophane",
    "Kodra e Trimave",
  ],
  Mitrovica: [
    "North Mitrovica",
    "South Mitrovica",
    "Bosniak Mahala",
    "Roma Mahalla",
    "Fidanishte",
    "Ilirida",
    "Zhabar i Poshtëm",
    "Mikronaselje (Lagjja e Minatorëve)",
    "Tri Solitera",
    "Dolina Doktoreve",
    "Brdjani (Kroi i Vitakut)",
    "Suvi Do (Suhodoll)",
  ],
  Peja: [
    "City Center (Bazaar/Çarshia)",
    "Babanaj",
    "Fidanishte",
    "Dardania",
    "Qyshk",
    "Rugova region (surrounding mountain communities)",
  ],
  Gjakova: [
    "City Center",
    "Bajram Curri",
    "Dardania",
    "Bajgora",
    "Gjakovë e Re",
    "Krasniqi",
    "Përlepnicë",
    "Blloku i Ri",
  ],
  Ferizaj: [
    "City Center",
    "Pika 6 / Zona akova",
    "Old Bazaar (Çarshia e Madhe / Hadumitku Mahala)",
    "Çabrati",
    "Ura e Gurit",
    "City Center",
    "...plus many rural settlements (e.g. Agaj, Botusha, Doli…) ",
  ],
  Gjilan: [
    "City Center / Old Bazaar",
    "Parku i Qytetit area",
    "Germia Park area",
    "...plus villages around Lake Badovc",
  ],
  Vushtrri: [
    "City Center (ancient fortress area)",
    "Rashan",
    "Roger",
    // (Note: larger town with surrounding villages)
  ],
  Shtime: ["City Center", "Strimberk", "Runik"],
  Obiliq: ["City Center", "Gërmadhë", "Llukar"],
  Lipjan: ["City Center", "Uçë", "Gllarevë"],
  "Fushë Kosovë": ["City Center", "Skivjan", "Bubël"],
  Drenas: ["City Center", "Komoran", "Likoc"],
  Kaçanik: ["City Center", "Besiane", "Proklate"],
  Dragash: ["City Center", "Brods"],
  Klinë: ["City Center", "Pekl", "Lukare"],
  Deçan: ["City Center", "Isniq", "Rashan"],
  Istog: ["City Center", "Lumbardh", "Stubëll"],
  Rahovec: ["City Center", "Malisheve", "Ormoc"],
  Suhareke: ["City Center", "Lower Suharekë", "Upper Suharekë"],
};

const numriIDhomave = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const cimerat = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const cmimi = [
  "0€",
  "50€",
  "100€",
  "150€",
  "200€",
  "250€",
  "300€",
  "350€",
  "400€",
  "450€",
  "500€",
  "550€",
  "600€",
  "650€",
  "700€",
  "750€",
  "800€",
  "850€",
  "900€",
  "950€",
  "1000€",
  "1050€",
  "1100€",
  "1150€",
  "1200€",
  "1250€",
  "1300€",
  "1350€",
  "1400€",
  "1450€",
  "1500+€",
];

export default function TabOneScreen() {
  const [disabled, setDisabled] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string | null>(null);
  const [selectedCimer, setSelectedCimer] = useState<string | null>(null);
  const [selectedPriceFrom, setSelectedPriceFrom] = useState<string | null>(null);
  const [selectedPriceTo, setSelectedPriceTo] = useState<string | null>(null);

  const cityRef = useRef<SelectDropdown>(null);
  const neighborHoodRef = useRef<SelectDropdown>(null);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 80,
        }}
        ListEmptyComponent={() => (
          <View>
            <Text>Asnjë rezultat</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexShrink: 1,
                flexDirection: "row",
                gap: 12,
                maxWidth: "100%",
              }}>
              <View
                style={{
                  flex: 1,
                  width: "100%",
                }}>
                <Text
                  style={{
                    marginBottom: 6,
                    width: "100%",
                  }}>
                  Qyteti
                </Text>
                <SelectDropdown
                  searchInputStyle={{
                    backgroundColor: "#E9ECEF",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                  searchPlaceHolder="Kërko qytetin..."
                  searchPlaceHolderColor="#6c757d"
                  search={true}
                  data={cities}
                  onSelect={(selectedItem, index) => {
                    setDisabled(false);
                    setSelectedCity((prev) => {
                      if (prev === selectedItem) {
                        return null; // Reset if the same city is selected
                      }
                      setSelectedNeighborhood(null); // Reset neighborhood when city changes
                      return selectedItem;
                    });
                  }}
                  ref={cityRef}
                  renderButton={(_, isOpened) => {
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
              </View>

              <View style={{ flex: 1, width: "100%" }}>
                <Text
                  style={{
                    marginBottom: 6,
                    width: "100%",
                  }}>
                  Lagja
                </Text>
                <SelectDropdown
                  search={true}
                  searchInputStyle={{
                    backgroundColor: "#E9ECEF",
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                  searchPlaceHolder="Kërko lagjen..."
                  searchPlaceHolderColor="#6c757d"
                  data={selectedCity ? neighborhoods[selectedCity] : []}
                  disabled={disabled}
                  ref={neighborHoodRef}
                  onSelect={(selectedItem, index) => {
                    setSelectedNeighborhood(selectedItem);
                  }}
                  renderButton={(_, isOpened) => {
                    return (
                      <View style={[styles.dropdownButtonStyle, disabled ? styles.dropdownButtonDisabledStyle : null]}>
                        <Text
                          style={[
                            styles.dropdownButtonTxtStyle,
                            disabled ? styles.dropdownButtonTxtDisabledStyle : null,
                          ]}>
                          {selectedNeighborhood || "Zgjedh"}
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
            </View>
            <View
              style={{
                flexShrink: 1,
                flexDirection: "row",
                gap: 12,
                maxWidth: "100%",
              }}>
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  flexDirection: "column",
                }}>
                <Text
                  style={{
                    marginBottom: 6,
                    width: "100%",
                  }}>
                  Numri i dhomave
                </Text>
                <SelectDropdown
                  data={numriIDhomave}
                  onSelect={(selectedItem, index) => {
                    setSelectedRooms(selectedItem);
                  }}
                  renderButton={(_, isOpened) => {
                    // Apply a different style if disabled
                    return (
                      <View style={[styles.dropdownButtonStyle]}>
                        <Text style={[styles.dropdownButtonTxtStyle]}>{selectedRooms || "Zgjedh"}</Text>
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
              <View
                style={{
                  flex: 1,
                  width: "100%",
                }}>
                <Text
                  style={{
                    marginBottom: 6,
                  }}>
                  Numri i cimerave
                </Text>
                <SelectDropdown
                  data={cimerat}
                  onSelect={(selectedItem, index) => {
                    setSelectedCimer(selectedItem);
                  }}
                  renderButton={(_, isOpened) => {
                    // Apply a different style if disabled
                    return (
                      <View style={[styles.dropdownButtonStyle]}>
                        <Text style={[styles.dropdownButtonTxtStyle]}>{selectedCimer || "Zgjedh"}</Text>
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
            </View>
            <View>
              <Text
                style={{
                  marginBottom: 6,
                }}>
                Çmimi
              </Text>
              <View
                style={{
                  flexShrink: 1,
                  flexDirection: "row",
                  gap: 12,
                  maxWidth: "100%",
                }}>
                <SelectDropdown
                  data={cmimi}
                  onSelect={(selectedItem, index) => {
                    setSelectedPriceFrom(selectedItem);
                  }}
                  renderButton={(_, isOpened) => {
                    // Apply a different style if disabled
                    return (
                      <View style={[styles.dropdownButtonStyle]}>
                        <Text style={[styles.dropdownButtonTxtStyle]}>{selectedPriceFrom || "Nga"}</Text>
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
                  data={cmimi}
                  onSelect={(selectedItem, index) => {
                    setSelectedPriceTo(selectedItem);
                  }}
                  renderButton={(_, isOpened) => {
                    // Apply a different style if disabled
                    return (
                      <View style={[styles.dropdownButtonStyle]}>
                        <Text style={[styles.dropdownButtonTxtStyle]}>{selectedPriceTo || "Deri në"}</Text>
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
            </View>
            {/* <AccordionView /> */}

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
          <CardItem
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

  title: {
    fontSize: 16,
    fontWeight: "light",
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

  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  dropdownButtonStyle: {
    width: "100%",
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
  dropdownButtonStyleFull: {
    width: "100%",
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
