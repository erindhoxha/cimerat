import { Controller, FieldValues, useForm } from 'react-hook-form';
import Colors from '@/constants/Colors';
import { useRef } from 'react';
import { Text } from '@/components/Text';
import Input from '@/components/Input/Input';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { TextInput } from 'react-native-gesture-handler/lib/typescript/components/GestureComponents';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function RegisterScreen() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const { setAuth } = useAuth();

  const router = useRouter();

  const passwordInputRef = useRef<TextInput>(null);

  const {
    mutateAsync: registerMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Gabim gjatë regjistrimit. Ju lutemi provoni përsëri.');
      }
      return json;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.userId);
      router.push('/');
      reset();
    },
  });

  const onSubmitHandler = async (data: FieldValues) => {
    await registerMutation({ username: data.username, password: data.password });
  };

  return (
    <Box padding={20} flex={1} style={styles.container}>
      <Box alignItems="center" marginBottom={16}>
        <Box style={styles.dragLine} />
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
                ref={ref}
                label="Emri i përdoruesit"
                required
                placeholder="Emri i përdoruesit"
                autoCapitalize="none"
                onChangeText={onChange}
                onBlur={onBlur}
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus();
                }}
                value={value}
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
            name="password"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Fjalëkalimi"
                label="Fjalëkalimi"
                required
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
          {errors.password && <Text style={styles.errorText}>Fjalëkalimi është i detyrueshëm</Text>}
        </Box>
        <Button variant="primary" onPress={handleSubmit(onSubmitHandler)} disabled={isPending || isSubmitting}>
          {isPending && isSubmitting ? <ActivityIndicator color="#fff" /> : <Text>Regjistrohu</Text>}
        </Button>
        {isError && (
          <Text style={styles.errorText}>{error instanceof Error ? error.message : 'Gabim gjatë kyçjes'}</Text>
        )}
        <Button variant="tertiary" onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Kthehu</Text>
        </Button>
      </Box>
      <Box marginTop={12} gap={12}>
        <Text>
          Keni një llogari?{' '}
          <Text
            onPress={() => {
              router.replace('/login');
            }}
            style={styles.linkText}
          >
            Kyçuni këtu
          </Text>
        </Text>
      </Box>
    </Box>
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
  errorText: {
    color: 'red',
    marginTop: 4,
  },
  linkText: {
    color: Colors.tint,
    textDecorationLine: 'underline',
  },
  backButtonText: {
    color: Colors.text,
  },
});
