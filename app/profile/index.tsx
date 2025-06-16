import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profili</Text>
      <Text style={{ marginTop: 16 }}>Përditëso email adresën</Text>
      <TextInput style={styles.textInput} placeholder="Email adresa" autoCapitalize="none" />
      <Text style={{ marginTop: 24 }}>Përditëso fjalëkalimin</Text>
      <TextInput style={styles.textInput} placeholder="Fjalëkalimi i ri" autoCapitalize="none" />
      <TouchableOpacity
        style={{
          backgroundColor: Colors.light.yellow,
          padding: 12,
          borderRadius: 12,
          marginTop: 12,
          alignItems: "center",
        }}>
        <Text style={{ color: "#000" }}>Perditëso të dhënat</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
});
