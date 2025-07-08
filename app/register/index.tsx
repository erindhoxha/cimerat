import { Controller, FieldValues, useForm } from "react-hook-form";
import Colors from "@/constants/Colors";
import { useRef } from "react";
import { Text } from "@/components/Text";
import Input from "@/components/Input/Input";
import { Box } from "@/components/Box";
import { Button } from "@/components/Button/Button";
import { Link, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/context/AuthContext";
import { TextInput } from "react-native-gesture-handler/lib/typescript/components/GestureComponents";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function RegisterScreen() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const { setToken } = useAuth();

  const router = useRouter();

  const passwordInputRef = useRef<TextInput>(null);

  const {
    mutateAsync: registerMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gabim gjatë regjistrimit. Ju lutemi provoni përsëri.");
      }
      return json;
    },
    onSuccess: (data) => {
      setToken(data.token);
      router.push("/");
      reset();
    },
  });

  const onSubmitHandler = async (data: FieldValues) => {
    await registerMutation({ email: data.email, password: data.password });
  };

  return (
    <Box padding={20} flex={1} style={styles.container}>
      <Box alignItems="center" marginBottom={16}>
        <Box style={{ height: 3, backgroundColor: Colors.light.gray, borderRadius: 32, width: 50 }} />
      </Box>
      <Box marginBottom={12}>
        <Text fontSize="xl" fontWeight="bold">
          Regjistrohu
        </Text>
      </Box>
      <Box gap={12}>
        <Box>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Input
                placeholder="Email adresa"
                autoCapitalize="none"
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
                value={value}
              />
            )}
            name="email"
            rules={{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }}
          />
          {errors.email && <Text style={{ color: "red", marginTop: 4 }}>Email është i detyrueshëm</Text>}
        </Box>
        <Box>
          <Controller
            control={control}
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Fjalëkalimi"
                ref={passwordInputRef}
                onBlur={onBlur}
                onChangeText={onChange}
                secureTextEntry
                autoCapitalize="none"
                value={value}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmitHandler)}
              />
            )}
          />
          {errors.password && <Text style={{ color: "red", marginTop: 4 }}>Fjalëkalimi është i detyrueshëm</Text>}
        </Box>
        <Button variant="primary" onPress={handleSubmit(onSubmitHandler)} disabled={isPending || isSubmitting}>
          {isPending && isSubmitting ? <ActivityIndicator color="#fff" /> : <Text>Regjistrohu</Text>}
        </Button>
        {isError && (
          <Text style={{ color: Colors.light.danger, marginTop: 4 }}>
            {error instanceof Error ? error.message : "Gabim gjatë kyçjes"}
          </Text>
        )}
      </Box>
      <Box marginTop={24} gap={12}>
        <Text>
          Keni një llogari?{" "}
          <Text
            onPress={() => {
              router.push("/login");
            }}
            style={{
              color: Colors.light.tint,
              textDecorationLine: "underline",
            }}>
            Kyçuni këtu
          </Text>
        </Text>
      </Box>
      <Button variant="secondary" style={{ marginTop: 24 }} onPress={() => router.back()}>
        <Text style={{ color: Colors.light.text }}>Kthehu</Text>
      </Button>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    borderRadius: 32, // or any value you want
    backgroundColor: "#fff",
    overflow: "hidden",
  },
});
