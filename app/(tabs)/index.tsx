import { FlatList, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { useEffect, useRef, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { CardItem } from "@/components/CardItem/CardItem";
import { cimerat, cities, cmimi, DATA, neighborhoods, numriIDhomave } from "@/mocks/mocks";
import { useRouter } from "expo-router";
import { Box } from "@/components/Box";
import Label from "@/components/Label/Label";
import { Text } from "@/components/Text";

interface SelectButtonProps {
  title: string | null;
  isOpened?: boolean;
  placeholder: string;
  disabled?: boolean;
}

const SelectButton = ({ title, isOpened, placeholder, disabled }: SelectButtonProps) => (
  <Box style={[styles.dropdownButtonStyle, disabled ? styles.dropdownButtonDisabledStyle : null]}>
    <Text style={[styles.dropdownButtonTxtStyle, disabled ? styles.dropdownButtonTxtDisabledStyle : null]}>
      {title || placeholder}
    </Text>
    <Text>
      <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
    </Text>
  </Box>
);

interface SelectItemProps {
  item: string | number;
  isSelected: boolean;
}

const SelectItem = ({ isSelected, item }: SelectItemProps) => {
  return (
    <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
      <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
    </Box>
  );
};

export default function TabOneScreen() {
  const [disabled, setDisabled] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string | null>(null);
  const [selectedCimer, setSelectedCimer] = useState<string | null>(null);
  const [selectedPriceFrom, setSelectedPriceFrom] = useState<number | null>(null);
  const [selectedPriceTo, setSelectedPriceTo] = useState<number | null>(null);

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
    <Box style={styles.container}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={() => (
          <Box>
            <Text>Asnjë rezultat</Text>
          </Box>
        )}
        ListHeaderComponent={() => (
          <>
            <Box flex={1} flexDirection="row" gap={12}>
              <Box flex={1}>
                <Label>Qyteti</Label>
                <SelectDropdown
                  searchInputStyle={styles.searchInputStyle}
                  searchPlaceHolder="Kërko qytetin..."
                  searchPlaceHolderColor="#6c757d"
                  search={true}
                  data={cities}
                  onSelect={(selectedItem, index) => {
                    setDisabled(false);
                    setSelectedCity((prev) => {
                      if (prev === selectedItem) {
                        return null;
                      }
                      setSelectedNeighborhood(null);
                      return selectedItem;
                    });
                  }}
                  ref={cityRef}
                  renderButton={(_, isOpened) => (
                    <>
                      <SelectButton title={selectedCity} isOpened={isOpened} placeholder="Zgjedh Qytetin" />
                    </>
                  )}
                  renderItem={(item, index, isSelected) => (
                    <>
                      <SelectItem item={item} isSelected={isSelected} />
                    </>
                  )}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </Box>
              <Box flex={1}>
                <Label>Lagja</Label>
                <SelectDropdown
                  search={true}
                  searchInputStyle={styles.searchInputStyle}
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
                      <>
                        <SelectButton
                          title={selectedNeighborhood}
                          isOpened={isOpened}
                          placeholder="Zgjedh Lagjen"
                          disabled={disabled}
                        />
                      </>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </Box>
            </Box>
            <Box
              flex={1}
              flexDirection="row"
              style={{
                gap: 12,
              }}>
              <Box flex={1} flexDirection="column">
                <Label>Numri i dhomave</Label>
                <SelectDropdown
                  data={numriIDhomave}
                  onSelect={(selectedItem, index) => {
                    setSelectedRooms(selectedItem);
                  }}
                  renderButton={(_, isOpened) => {
                    return (
                      <>
                        <SelectButton title={selectedRooms} isOpened={isOpened} placeholder="Zgjedh" />
                      </>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </Box>
              <Box flex={1}>
                <Label>Numri i Cimerave</Label>
                <SelectDropdown
                  data={cimerat}
                  onSelect={(selectedItem, index) => {
                    setSelectedCimer(selectedItem);
                  }}
                  renderButton={(_, isOpened) => {
                    // Apply a different style if disabled
                    return (
                      <>
                        <SelectButton title={selectedCimer} isOpened={isOpened} placeholder="Zgjedh" />
                      </>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </Box>
            </Box>
            <Box>
              <Label>Çmimi</Label>
              <Box flex={1} flexDirection="row" gap={12}>
                <SelectDropdown
                  data={cmimi}
                  onSelect={(selectedItem, index) => {
                    setSelectedPriceFrom(selectedItem);
                    if (selectedPriceTo && selectedItem > selectedPriceTo) {
                      setSelectedPriceTo(null);
                    }
                  }}
                  defaultValue={selectedPriceFrom}
                  renderButton={(_, isOpened) => {
                    // Apply a different style if disabled
                    return (
                      <Box
                        flex={1}
                        style={{
                          flexShrink: 1,
                        }}>
                        <SelectButton
                          title={(selectedPriceFrom && selectedPriceFrom + "€") || "Nga"}
                          isOpened={isOpened}
                          placeholder="Zgjedh"
                        />
                      </Box>
                    );
                  }}
                  renderItem={(item, _, isSelected) => {
                    return (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />

                <SelectDropdown
                  data={selectedPriceFrom == null ? cmimi : cmimi.filter((price) => price > selectedPriceFrom)}
                  onSelect={(selectedItem) => {
                    setSelectedPriceTo(selectedItem);
                  }}
                  defaultValue={selectedPriceTo}
                  renderButton={(_, isOpened) => {
                    return (
                      <Box
                        flex={1}
                        style={{
                          flexShrink: 1,
                        }}>
                        <SelectButton
                          title={(selectedPriceTo && selectedPriceTo + "€") || "Deri në"}
                          isOpened={isOpened}
                          placeholder="Zgjedh"
                        />
                      </Box>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <>
                        <SelectItem item={item} isSelected={isSelected} />
                      </>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </Box>
            </Box>
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
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  searchInputStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
