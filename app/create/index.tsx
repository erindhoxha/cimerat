import { SelectDropdownComponent } from "@/components/SelectDropdown";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import { Button, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import SelectDropdown from "react-native-select-dropdown";

export default function CreateScreen() {
  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>Krijo një listim të ri</Text>

      <SelectDropdownComponent
        label="Lloji i Listimit"
        options={["Apartament", "Shtëpi", "Zyrë"]}
        placeholder="Zgjedh Llojin e Listimit"
        onSelect={() => {}}
      />

      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "transparent",
        }}>
        <Text
          style={{
            marginBottom: 6,
            width: "100%",
          }}>
          Qyteti<Text style={{ color: "red" }}>*</Text>
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
            // Apply a different style if disabled
            return (
              <View style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{"Zgjedh Qytetin"}</Text>
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
          backgroundColor: "transparent",
        }}>
        <Text
          style={{
            marginBottom: 6,
            width: "100%",
          }}>
          Lagja<Text style={{ color: "red" }}>*</Text>
        </Text>
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
            // Apply a different style if disabled
            return (
              <View style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{"Zgjedh Lagjën"}</Text>
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

      <Text
        style={{
          marginBottom: 8,
        }}>
        Titulli<Text style={{ color: "red" }}>*</Text>
      </Text>
      <TextInput
        placeholder="Titulli i listimit"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        }}
      />
      <Text
        style={{
          marginBottom: 8,
        }}>
        Përshkrimi<Text style={{ color: "red" }}>*</Text>
      </Text>
      <TextInput
        placeholder="Përshkrimi"
        multiline
        numberOfLines={10}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          height: 150,
          marginBottom: 20,
        }}
      />

      <Text
        style={{
          marginBottom: 8,
        }}>
        Çmimi<Text style={{ color: "red" }}>*</Text>
      </Text>
      <TextInput
        placeholder="Çmimi i listimit"
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        }}
      />

      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "transparent",
        }}>
        <Text
          style={{
            marginBottom: 6,
            width: "100%",
          }}>
          Numri i Dhomave
        </Text>
        <SelectDropdown
          searchInputStyle={{
            backgroundColor: "#E9ECEF",
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
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
            // Apply a different style if disabled
            return (
              <View style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{"Numri i Dhomave"}</Text>
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
          backgroundColor: "transparent",
        }}>
        <Text
          style={{
            marginBottom: 6,
            width: "100%",
          }}>
          Numri i Cimerave
        </Text>
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
            // Apply a different style if disabled
            return (
              <View style={[styles.dropdownButtonStyle]}>
                <Text style={[styles.dropdownButtonTxtStyle]}>{"Numri i Cimerave"}</Text>
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

      <TouchableOpacity
        style={{
          backgroundColor: Colors.light.yellow,
          padding: 12,
          borderRadius: 12,
          alignItems: "center",
        }}>
        <Text style={{ color: "#000" }}>Krijo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  dropdownButtonStyleFull: {
    width: "100%",
    height: 50,
    marginBottom: 12,
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
