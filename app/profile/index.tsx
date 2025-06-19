import Box from "@/components/Box/Box";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  return (
    <Box flex={1} padding={24}>
      <Text fontSize="xl" fontWeight="bold">
        Profili
      </Text>
      <Box marginTop={12}>
        <Text>Përditëso email adresën</Text>
        <TextInput style={styles.textInput} placeholder="Email adresa" autoCapitalize="none" />
      </Box>
      <Box marginTop={24}>
        <Text>Përditëso fjalëkalimin</Text>
        <TextInput style={styles.textInput} placeholder="Fjalëkalimi i ri" autoCapitalize="none" />
      </Box>
      <TouchableOpacity style={styles.primaryButton}>
        <Text>Perditëso të dhënat</Text>
      </TouchableOpacity>
    </Box>
  );
}

const styles = StyleSheet.create({
  textInput: {
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: Colors.light.yellow,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
});
