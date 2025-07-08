import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <Box flex={1} padding={20} gap={12} style={styles.container}>
      <Box alignItems="center" marginBottom={16}>
        <Box style={{ height: 3, backgroundColor: Colors.light.gray, borderRadius: 32, width: 50 }} />
      </Box>
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
      <Button variant="secondary" style={{ marginTop: 12 }} onPress={() => router.back()}>
        <Text style={{ color: Colors.light.text }}>Kthehu</Text>
      </Button>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    borderRadius: 32, // or any value you want
    backgroundColor: "#fff",
    overflow: "hidden",
  },
});
