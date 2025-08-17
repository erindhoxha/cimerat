import { StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { View } from '@/components/View/View';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import Input from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { useRef } from 'react';

export default function LoginScreen() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();
  const { setAuth } = useAuth();

  const router = useRouter();

  const passwordRef = useRef<TextInput>(null);

  const {
    mutateAsync: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gabim gjatë kyçjes. Ju lutemi provoni përsëri.');
      }
      return json;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.userId, data.username);
      reset();
    },
  });

  const onSubmitHandler = async (data: FieldValues) => {
    await loginMutation({ username: data.username, password: data.password });
  };

  return (
    <View style={styles.container}>
      <Box alignItems="center" marginBottom={16}>
        <Box style={styles.dragLine} />
      </Box>
      <Box style={styles.header}>
        <Text fontSize="xl" fontWeight="bold">
          Kyçu
        </Text>
      </Box>
      <Box gap={12}>
        <Box>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Emri në aplikacion"
                placeholder="Pershembull: cimeri1994"
                required
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
              />
            )}
            name="username"
            rules={{ required: true }}
          />
          {errors.username && <Text style={styles.errorText}>Emri është i detyrueshëm</Text>}
        </Box>
        <Box>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Fjalëkalimi"
                ref={passwordRef}
                placeholder="Fjalëkalimi"
                onBlur={onBlur}
                required
                secureTextEntry
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmitHandler)}
              />
            )}
            name="password"
            rules={{ required: true, minLength: 6 }}
          />
          {errors.password && <Text style={styles.errorText}>Fjalëkalimi është i detyrueshëm</Text>}
        </Box>
        <Button onPress={handleSubmit(onSubmitHandler)} disabled={isPending || isSubmitting}>
          {isPending && isSubmitting ? <ActivityIndicator color="#fff" /> : <Text>Kyçu</Text>}
        </Button>
        {isError && (
          <Text style={styles.globalErrorText}>{error instanceof Error ? error.message : 'Gabim gjatë kyçjes'}</Text>
        )}
      </Box>
      <Button variant="tertiary" style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Kthehu</Text>
      </Button>
      <Text
        onPress={() => {
          router.replace('/register');
        }}
        style={styles.linkText}
      >
        Nuk keni llogari? Regjistrohu këtu.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    borderRadius: 32,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dragLine: {
    height: 3,
    backgroundColor: Colors.gray,
    borderRadius: 32,
    width: 50,
  },
  header: {
    marginBottom: 12,
  },
  linkText: {
    marginTop: 12,
    color: Colors.tint,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: Colors.danger,
    marginTop: 4,
  },
  globalErrorText: {
    color: Colors.danger,
  },
  backButton: {
    marginTop: 12,
  },
  backButtonText: {
    color: Colors.text,
  },
});
