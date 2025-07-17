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
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch("http://localhost:3000/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gabim gjatë kyçjes. Ju lutemi provoni përsëri.");
      }
      return json;
    },
    onSuccess: (data) => {
      setToken(data.token);
      reset();
    },
  });

  console.log(errors);

  const onSubmitHandler = async (data: FieldValues) => {
    await loginMutation({ username: data.username, password: data.password });
  };

  return (
    <View style={styles.container}>
      {/* Add a line at the top that indicates that it can be draggable */}
      <Box alignItems="center" marginBottom={16}>
        <Box style={{ height: 3, backgroundColor: Colors.light.gray, borderRadius: 32, width: 50 }} />
      </Box>

      <Box marginBottom={12}>
        <Text fontSize="xl" fontWeight="bold">
          Kyçu
        </Text>
      </Box>
      <Box gap={12}>
        <Box>
          <Label>Emri i përdoruesit</Label>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Emri i përdoruesit"
                onBlur={onBlur}
                onChangeText={(value) => onChange(value)}
                value={value}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />
            )}
            name="username"
            rules={{ required: true }}
          />
          {errors.username && (
            <Text style={{ color: Colors.light.danger, marginTop: 4 }}>username është i detyrueshëm</Text>
          )}
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
          <Link href="/register" style={styles.linkText}>
            Regjistrohu
          </Link>
        </Box>
      </Box>
      <Button variant="secondary" style={{ marginTop: 12 }} onPress={() => router.back()}>
        <Text style={{ color: Colors.light.text }}>Kthehu</Text>
      </Button>
    </View>
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
  linkText: {
    color: Colors.light.tint,
    textDecorationLine: "underline",
  },
  header: {
    marginBottom: 16,
  },
});
