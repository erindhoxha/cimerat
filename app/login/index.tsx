import { StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { View } from "@/components/View/View";
import { Box } from "@/components/Box";
import { Text } from "@/components/Text";
import Input from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import Label from "@/components/Label";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRef } from "react";

export default function LoginScreen() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const { setToken } = useAuth();

  const router = useRouter();

  const passwordRef = useRef<TextInput>(null);

  const {
    mutateAsync: loginMutation,
    status,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    },
    onSuccess: (data) => {
      setToken(data.token);
      router.push("/");
      reset();
    },
  });

  const onSubmitHandler = async (data: FieldValues) => {
    await loginMutation({ email: data.email, password: data.password });
  };

  console.log(status, isSubmitting);

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
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
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
                ref={passwordRef}
                placeholder="Fjalëkalimi"
                onBlur={onBlur}
                required
                secureTextEntry
                value={value}
                onChangeText={(value) => onChange(value)}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmitHandler)}
              />
            )}
            name="password"
            rules={{ required: true, minLength: 6 }}
          />
          {errors.password && (
            <Text style={{ color: Colors.light.danger, marginTop: 4 }}>Fjalëkalimi është i detyrueshëm</Text>
          )}
        </Box>

        <Button variant="primary" onPress={handleSubmit(onSubmitHandler)} disabled={isPending || isSubmitting}>
          {isPending && isSubmitting ? <ActivityIndicator color="#fff" /> : <Text>Kyçu</Text>}
        </Button>
        {isError && (
          <Text style={{ color: Colors.light.danger, marginTop: 4 }}>
            {error instanceof Error ? error.message : "Gabim gjatë kyçjes"}
          </Text>
        )}
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
    padding: 20,
  },
  linkText: {
    color: Colors.light.tint,
    textDecorationLine: "underline",
  },
  header: {
    marginBottom: 16,
  },
});
