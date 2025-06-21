import { StyleSheet, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { View } from "@/components/View/View";
import { Box } from "@/components/Box";
import { Text } from "@/components/Text";
import Input from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";

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
            reset();
          })}>
          <Text>Kyçu</Text>
        </Button>
        <Box>
          <Text
            style={styles.linkText}
            onPress={() => {
              router.push("/forgot-password");
            }}>
            Harrove fjalëkalimin?
          </Text>
        </Box>
        <Box>
          <Link href="/register" style={styles.linkText}>
            Regjistrohu
          </Link>
        </Box>
      </Box>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  linkText: {
    color: Colors.light.tint,
    textDecorationLine: "underline",
  },
  header: {
    marginBottom: 16,
  },
});
