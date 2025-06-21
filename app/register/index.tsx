import { useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Text } from "@/components/Text";
import Input from "@/components/Input/Input";
import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";

export default function RegisterScreen() {
  const [submitted, setSubmitted] = useState(false);
  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  return (
    <Box padding={24} flex={1}>
      <Box marginBottom={12}>
        <Text fontSize="xl" fontWeight="bold">
          Regjistrohu
        </Text>
      </Box>
      <Box gap={12}>
        <Box>
          <Input placeholder="Email adresa" autoCapitalize="none" onChangeText={(text) => setValue("email", text)} />
          {errors.email && <Text style={{ color: "red", marginTop: 4 }}>Email është i detyrueshëm</Text>}
        </Box>
        <Box>
          <Input placeholder="Fjalëkalimi" secureTextEntry onChangeText={(text) => setValue("password", text)} />
          {errors.password && <Text style={{ color: "red", marginTop: 4 }}>Fjalëkalimi është i detyrueshëm</Text>}
        </Box>
        <Button
          variant="primary"
          onPress={handleSubmit((data) => {
            setSubmitted(true);
            // Handle register action with data
            reset();
          })}>
          <Text>
            {submitted ? (
              <>
                Derguar <FontAwesome name="check" />
              </>
            ) : (
              "Regjistrohu"
            )}{" "}
          </Text>
        </Button>
      </Box>
      <Box marginTop={24} gap={12}>
        <Text>
          Keni pranuar nje email me udhëzimet për regjistrim. Ju lutemi kontrolloni kutinë tuaj të postës elektronike
          për të vazhduar.
        </Text>
        <Text
          style={{
            color: Colors.light.tint,
            textDecorationLine: "underline",
          }}
          onPress={() => {
            // Handle forgot password action
          }}>
          Nese nuk keni marrë emailin, provojeni përsëri
        </Text>
      </Box>
    </Box>
  );
}
