import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";

export default function LoginScreen() {
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Kyçu</Text>
      <TextInput
        style={{
          padding: 12,
          marginTop: 12,
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
          // Handle login action with data
          reset();
        })}>
        <Text style={{ color: "#000" }}>Kyçu</Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 20,
          color: Colors.light.tint,
          textDecorationLine: "underline",
        }}
        onPress={() => {
          router.push("/forgot-password");
          // Handle forgot password action
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
