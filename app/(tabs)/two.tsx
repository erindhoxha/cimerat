import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: "#fff", borderRadius: 10, marginBottom: 0 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Listimet tua</Text>
        <TouchableOpacity
          onPress={() => {
            // Handle create listing action
          }}
          style={{
            backgroundColor: Colors.light.yellow,
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
          <Text style={{ color: "#000", fontSize: 16 }}>Krijo një listim të ri</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={{ marginTop: 10 }}>
        Nuk keni asnjë listim të krijuar. Shtoni një listim të ri duke klikuar në butonin "Krijo" në skedën e sipërme.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 16,
  },
  separator: {
    marginBottom: 12,
    height: 1,
    width: "100%",
  },
});
