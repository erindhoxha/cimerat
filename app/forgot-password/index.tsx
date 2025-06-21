import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import { Text } from "@/components/Text";
import { View } from "@/components/View/View";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text fontSize="xl" fontWeight="bold" style={{ marginBottom: 16 }}>
        Harruar Fjalëkalimin
      </Text>
      <Input placeholder="Email adresa" autoCapitalize="none" />
      <Button variant="primary">
        <Text>Dërgo Emailin e Rindërtimit</Text>
      </Button>
      <Box marginTop={16}>
        <Text>Do të marrësh një email me udhëzime për të rindërtuar fjalëkalimin tënd.</Text>
      </Box>
      <Box marginTop={20} alignItems="center">
        <Button
          variant="primary"
          onPress={() => {
            router.push("/login");
          }}>
          <Text>Kthehu në Kyçje</Text>
        </Button>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: Colors.light.yellow,
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
});
