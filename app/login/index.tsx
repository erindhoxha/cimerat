import { StyleSheet } from "react-native";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import { View } from "@/components/View/View";
import { Box } from "@/components/Box";
import { Text } from "@/components/Text";
import Input from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import Label from "@/components/Label";

export default function LoginScreen() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

  const onSubmitHandler = (data: FieldValues) => {
    console.log(data);
    reset();
  };

  return (
    <View style={styles.container}>
      <Box marginBottom={12}>
        <Text fontSize="xl" fontWeight="bold">
          Kyçu
        </Text>
      </Box>
      <Box gap={12}>
        <Box>
          <Label>Email adresa</Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Email adresa"
                onBlur={onBlur}
                keyboardType="email-address"
                onChangeText={(value) => onChange(value)}
                value={value}
              />
            )}
            name="email"
            rules={{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
          />
          {errors.email && <Text style={{ color: Colors.light.danger, marginTop: 4 }}>Email është i detyrueshëm</Text>}
        </Box>
        <Box>
          <Label>Fjalëkalimi</Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Fjalëkalimi"
                onBlur={onBlur}
                required
                secureTextEntry
                value={value}
                onChangeText={(value) => onChange(value)}
              />
            )}
            name="password"
            rules={{ required: true, minLength: 6 }}
          />
          {errors.password && (
            <Text style={{ color: Colors.light.danger, marginTop: 4 }}>Fjalëkalimi është i detyrueshëm</Text>
          )}
        </Box>
        <Button
          variant="primary"
          onPress={handleSubmit((data) => {
            onSubmitHandler(data);
          })}>
          <Text>Kyçu</Text>
        </Button>
        <Box>
          <Link href="/forgot-password" asChild>
            <Text style={styles.linkText}>Harrove fjalëkalimin?</Text>
          </Link>
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
