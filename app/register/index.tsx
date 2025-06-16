import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>Regjistrohu</Text>
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
          setSubmitted(true);
          // Handle register action with data
          reset();
        })}>
        <Text style={{ color: "#000" }}>
          {submitted ? (
            <>
              Derguar <FontAwesome name="check" />
            </>
          ) : (
            "Regjistrohu"
          )}{" "}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 20,
        }}>
        Keni pranuar nje email me udhëzimet për regjistrim. Ju lutemi kontrolloni kutinë tuaj të postës elektronike për
        të vazhduar.
      </Text>
      <Text
        style={{
          marginTop: 20,
          color: Colors.light.tint,
          textDecorationLine: "underline",
        }}
        onPress={() => {
          // Handle forgot password action
        }}>
        Nese nuk keni marrë emailin, provojeni përsëri
      </Text>
    </View>
  );
}
