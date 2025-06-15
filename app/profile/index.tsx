import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { TextInput, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profili</Text>
      <Text style={{ marginTop: 16 }}>Përditëso email adresën</Text>
      <TextInput
        style={{
          padding: 12,
          marginTop: 12,
          borderWidth: 1,
          borderRadius: 12,
        }}
        placeholder="Email adresa"
        autoCapitalize="none"
      />
      <Text style={{ marginTop: 24 }}>Përditëso fjalëkalimin</Text>
      <TextInput
        style={{
          padding: 12,
          marginTop: 12,
          borderWidth: 1,
          borderRadius: 12,
        }}
        keyboardType="visible-password"
        placeholder="Fjalëkalimi i ri"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={{
          backgroundColor: Colors.light.yellow,
          padding: 12,
          borderRadius: 12,
          marginTop: 20,
          alignItems: "center",
        }}>
        <Text style={{ color: "#000" }}>Perditëso të dhënat</Text>
      </TouchableOpacity>
    </View>
  );
}
