import { Controller, FieldValues, useForm } from 'react-hook-form';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import Colors from '@/constants/Colors';
import { useRef } from 'react';
import { Text } from '@/components/Text';
import Input from '@/components/Input/Input';
import { Box } from '@/components/Box';
import { Button } from '@/components/Button/Button';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { TextInput } from 'react-native-gesture-handler/lib/typescript/components/GestureComponents';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { WebView } from '@/components/WebView/WebView';

export default function RegisterScreen() {
  const {
    handleSubmit,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const { setAuth } = useAuth();

  const router = useSafeRouter();

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
        body: JSON.stringify({
          username: data.username.toLowerCase(),
          password: data.password,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Rejecting with an Error (not a string) so the server's message reaches the UI
        const error = new Error(json.error || 'Gabim gjatë regjistrimit. Ju lutemi provoni përsëri.');
        return Promise.reject(Object.assign(error, { status: res.status }));
      }
      return json;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.userId, data.username);
      reset();
    },
    onError: (error: Error & { status?: number }) => {
      // Username taken: show it on the field itself
      if (error.status === 409) setError('username', { message: error.message });
    },
  });

  const onSubmitHandler = async (data: FieldValues) => {
    await registerMutation({ username: data.username, password: data.password });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <WebView>
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
              render={({ field: { onChange, onBlur, value, ref }, fieldState: { error } }) => (
                <>
                  <Input
                    ref={ref}
                    label="Emri i përdoruesit"
                    required
                    placeholder="Emri i përdoruesit"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="done"
                    onSubmitEditing={() => {
                      passwordInputRef.current?.focus();
                    }}
                    value={value}
                  />
                  {error && <Text style={styles.errorText}>{error.message}</Text>}
                </>
              )}
              name="username"
              rules={{
                required: 'Emri i përdoruesit është i detyrueshëm',
                minLength: { value: 3, message: 'Emri i përdoruesit duhet të ketë të paktën 3 karaktere' },
                pattern: {
                  value: /^[a-zA-Z0-9]+$/,
                  message: 'Lejohen vetëm shkronja dhe numra, pa hapësira apo karaktere të veçanta.',
                },
              }}
            />
          </Box>
          <Box>
            <Controller
              control={control}
              name="password"
              rules={{
                required: 'Fjalëkalimi është i detyrueshëm',
                minLength: { value: 6, message: 'Fjalëkalimi duhet të ketë të paktën 6 karaktere' },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Të paktën 6 karaktere"
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
            {errors.password && <Text style={styles.errorText}>{String(errors.password.message)}</Text>}
          </Box>
          <Button onPress={handleSubmit(onSubmitHandler)} disabled={isPending || isSubmitting}>
            {isPending && isSubmitting ? <ActivityIndicator color="#fff" /> : <Text>Regjistrohu</Text>}
          </Button>
          {/* 409 is already shown under the username field */}
          {isError && (error as Error & { status?: number }).status !== 409 && (
            <Text style={styles.errorText}>{error.message}</Text>
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
      </WebView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  dragLine: {
    height: 3,
    backgroundColor: Colors.gray,
    borderRadius: 32,
    width: 50,
  },
  errorText: {
    color: Colors.danger,
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
