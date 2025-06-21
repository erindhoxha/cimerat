import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text";
import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  return (
    <Box
      flex={1}
      padding={24}
      style={{
        gap: 12,
      }}>
      <Text fontSize="xl" fontWeight="bold">
        Profili
      </Text>
      <Box>
        <Box>
          <Input label="Përditëso email adresën" placeholder="Email adresa" autoCapitalize="none" />
        </Box>
        <Box>
          <Input label="Përditëso fjalëkalimin" placeholder="Fjalëkalimi i ri" autoCapitalize="none" />
        </Box>
        <Button variant="primary">Perditëso të dhënat</Button>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.light.yellow,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: "center",
  },
});
