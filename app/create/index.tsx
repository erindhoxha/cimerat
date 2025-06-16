import { Text } from "@/components/Themed";
import { Button, ScrollView, TextInput } from "react-native";

export default function CreateScreen() {
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 20 }}>Krijo një listim të ri</Text>
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
      <TextInput
        placeholder="Përshkrimi"
        multiline
        numberOfLines={4}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        }}
      />
      <Button title="Krijo Listimin" onPress={() => alert("Listimi u krijua!")} />
    </ScrollView>
  );
}
