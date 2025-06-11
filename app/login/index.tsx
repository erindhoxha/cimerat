import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import Colors from "@/constants/Colors";

export default function LoginScreen() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Kyçu</Text>
      <TextInput
        style={{
          padding: 12,
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
        }}
        placeholder="Email adresa"
        {...register("email", { required: true })}
      />
      <TextInput
        style={{
          padding: 12,
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
        }}
        placeholder="Fjalëkalimi"
        {...register("email", { required: true })}
      />
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
          console.log(data);
          reset(); // Reset form after submission
        })}>
        <Text style={{ color: "#000" }}>Kyçu</Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 20,
          color: "#007BFF",
          textDecorationLine: "underline",
        }}
        onPress={() => {
          // Handle forgot password action
        }}>
        Harrove fjalëkalimin?
      </Text>
      <Text
        style={{
          marginTop: 20,
          color: "#007BFF",
          textDecorationLine: "underline",
        }}
        onPress={() => {
          // Handle sign up action
        }}>
        Regjistrohu
      </Text>
    </View>
  );
}
