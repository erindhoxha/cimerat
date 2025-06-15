import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useRouter } from "expo-router";
import { TextInput, TouchableOpacity } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Harruar Fjalëkalimin</Text>
      <TextInput
        style={{
          padding: 12,
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
        }}
        placeholder="Email adresa"
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
        <Text style={{ color: "#000" }}>Dërgo Emailin e Rindërtimit</Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 16,
          textAlign: "center",
          color: "#888",
        }}>
        Do të marrësh një email me udhëzime për të rindërtuar fjalëkalimin tënd.
      </Text>

      <TouchableOpacity
        style={{
          marginTop: 20,
          alignItems: "center",
        }}
        onPress={() => {
          router.push("/login");
          // Navigate to login screen
        }}>
        <Text style={{ color: Colors.light.yellow }}>Kthehu në Kyçje</Text>
      </TouchableOpacity>
    </View>
  );
}
