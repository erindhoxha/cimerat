import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import Label from "@/components/Label";
import { Text } from "@/components/Text";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, StyleSheet } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

export default function CreateScreen() {
  return (
    <ScrollView style={styles.container}>
      <Box marginBottom={20}>
        <Text fontSize="xl" fontWeight="bold">
          Krijo një listim të ri
        </Text>
      </Box>
      <Box
        flex={1}
        style={{
          width: "100%",
          backgroundColor: "transparent",
        }}>
        <Label>
          Qyteti<Text style={{ color: "red" }}>*</Text>
        </Label>
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
          data={[
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
          ]}
          onSelect={(selectedItem, index) => {
            return undefined;
          }}
          renderButton={(_, isOpened) => {
            return (
              <Box style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{"Zgjedh Qytetin"}</Text>
                <Text>
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                </Text>
              </Box>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </Box>

      <Box
        flex={1}
        style={{
          width: "100%",
          backgroundColor: "transparent",
        }}>
        <Label>
          Lagja<Text style={{ color: "red" }}>*</Text>
        </Label>
        <SelectDropdown
          searchInputStyle={{
            backgroundColor: "#E9ECEF",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          searchPlaceHolder="Kërko lagjën..."
          searchPlaceHolderColor="#6c757d"
          search={true}
          data={[
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
          ]}
          onSelect={(selectedItem, index) => {
            return undefined;
          }}
          renderButton={(_, isOpened) => {
            return (
              <Box style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{"Zgjedh Lagjën"}</Text>
                <Text>
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                </Text>
              </Box>
            );
          }}
          renderItem={(item, _, isSelected) => {
            return (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </Box>
      <Input label="Titulli" placeholder="Titulli i listimit" required />
      <Input label="Përshkrimi" placeholder="Përshkrimi" multiline numberOfLines={10} required />
      <Input label="Çmimi në euro (€)" placeholder="300" required keyboardType="number-pad" />
      <Box>
        <Label>Numri i dhomave në total (Opsional)</Label>
        <SelectDropdown
          data={[
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
          ]}
          onSelect={(selectedItem, index) => {
            return undefined;
          }}
          renderButton={(_, isOpened) => {
            return (
              <Box style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>Zgjedh</Text>
                <Text>
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                </Text>
              </Box>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </Box>
      <Box>
        <Label>Sa cimera do ti ketë shtepia/apartmenti? (Opsional)</Label>
        <SelectDropdown
          searchInputStyle={{
            backgroundColor: "#E9ECEF",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          searchPlaceHolder="Kërko lagjën..."
          searchPlaceHolderColor="#6c757d"
          search={true}
          data={[
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
          ]}
          onSelect={(selectedItem, index) => {
            return undefined;
          }}
          renderButton={(_, isOpened) => {
            return (
              <Box style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>Zgjedh</Text>
                <Text>
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                </Text>
              </Box>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </Box>
      <Box>
        <Label>Sa cimera janë tani? (Opsional)</Label>
        <SelectDropdown
          searchInputStyle={{
            backgroundColor: "#E9ECEF",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
          searchPlaceHolder="Kërko lagjën..."
          searchPlaceHolderColor="#6c757d"
          search={true}
          data={[
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
          ]}
          onSelect={(selectedItem, index) => {
            return undefined;
          }}
          renderButton={(_, isOpened) => {
            return (
              <Box style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>Zgjedh</Text>
                <Text>
                  <FontAwesome name={isOpened ? "chevron-up" : "chevron-down"} />
                </Text>
              </Box>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <Box style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: "#D2D9DF" }) }}>
                <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
              </Box>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      </Box>
      <Button
        variant="primary"
        style={{
          marginBottom: 48,
        }}>
        Krijo Listimin
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "white", gap: 12, paddingBottom: 64 },
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexShrink: 1,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.gray,
  },
  dropdownMenuStyle: {
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
