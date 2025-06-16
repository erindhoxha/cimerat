import { FlatList, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import SelectDropdown from "react-native-select-dropdown";
import { useEffect, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { CardItem } from "@/components/CardItem";
import { cimerat, cities, cmimi, DATA, neighborhoods, numriIDhomave } from "@/constants/mock";
import { useRouter } from "expo-router";

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

  const router = useRouter();

  useEffect(() => {
    if (router.canGoBack()) {
      router.dismissAll();
      router.replace("/");
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
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
          </>
        )}
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
  contentContainerStyle: {
    padding: 20,
    paddingBottom: 80,
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
});
