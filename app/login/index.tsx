import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { Text, View } from "@/components/Themed";
import Box from "@/components/Box";

export default function LoginScreen() {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Box marginBottom={12}>
        <Text fontSize="xl" fontWeight="bold">
          Kyçu
        </Text>
      </Box>
      <TextInput
        style={{
          padding: 12,
          borderWidth: 1,
          borderColor: errors.email ? "red" : "#ccc",
          borderRadius: 12,
        }}
        placeholder="Email adresa"
        autoCapitalize="none"
        onChangeText={(text) => setValue("email", text)}
      />
      {errors.email && <Text style={{ color: "red", marginTop: 4 }}>Email është i detyrueshëm</Text>}
      <TextInput
        style={{
          padding: 12,
          marginTop: 12,
          borderWidth: 1,
          borderColor: errors.password ? "red" : "#ccc",
          borderRadius: 12,
        }}
        placeholder="Fjalëkalimi"
        secureTextEntry
        onChangeText={(text) => setValue("password", text)}
      />
      {errors.password && <Text style={{ color: "red", marginTop: 4 }}>Fjalëkalimi është i detyrueshëm</Text>}
      <TouchableOpacity
        style={{
          backgroundColor: Colors.light.yellow,
          padding: 12,
          borderRadius: 12,
          marginTop: 20,
          alignItems: "center",
        }}
        onPress={handleSubmit((data) => {
          reset();
        })}>
        <Text>Kyçu</Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 20,
          color: Colors.light.tint,
          textDecorationLine: "underline",
        }}
        onPress={() => {
          router.push("/forgot-password");
        }}>
        Harrove fjalëkalimin?
      </Text>
      <Link
        href="/register"
        style={{
          marginTop: 20,
          color: Colors.light.tint,
          textDecorationLine: "underline",
        }}>
        Regjistrohu
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginBottom: 16,
  },
});
