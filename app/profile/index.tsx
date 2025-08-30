import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/Text';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '@/components/Input';
import Label from '@/components/Label';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { WebView } from '@/components/WebView/WebView';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesome } from '@expo/vector-icons';

interface Mutation {
  userId: string | null;
  username: string;
  password: string;
  oldPassword: string;
}

const formSchema = z.object({
  oldPassword: z.string().min(6, 'Fjalëkalimi i vjetër është i detyrueshëm, dhe duhet të ketë të paktën 6 karaktere'),
  newPassword: z.string().min(6, 'Fjalëkalimi i ri është i detyrueshëm, dhe duhet të ketë të paktën 6 karaktere'),
});

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { token, userId, setAuth } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const { data, error, status } = useQuery({
    queryKey: ['user'],
    enabled: !!token,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        return Promise.reject(
          (await res.json()) ||
            'Gabim gjatë përditësimit. Mund te jetë se fjalëkalimi juaj është i gabuar. Ju lutemi provoni përsëri.',
        );
      }
      return res.json();
    },
  });

  const {
    mutateAsync: updateMutation,
    error: mutationError,
    isPending,
  } = useMutation({
    mutationFn: async (variables: Mutation) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/edit-user`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        method: 'PUT',
        body: JSON.stringify(variables),
      });
      const json = await res.json();
      if (!res.ok) {
        return Promise.reject({
          message:
            json.message ||
            'Gabim gjatë përditësimit. Mund te jetë se fjalëkalimi juaj është i gabuar. Ju lutemi provoni përsëri',
        });
      }
      return json;
    },
  });

  if (status === 'pending') {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Duke ngarkuar...</Text>
      </Box>
    );
  }

  const {
    user: { username },
  } = data;

  const onSubmitHandler = async (data: FieldValues) => {
    await updateMutation(
      {
        userId,
        username: data?.user?.username ?? username,
        oldPassword: data.oldPassword,
        password: data.newPassword,
      },
      {
        onSuccess() {
          Toast.show({ type: 'success', text1: 'Përdoruesi u përditësua me sukses' });
          router.push('/');
        },
      },
    );
  };

  const isWeb = Platform.OS === 'web';

  return (
    <ScrollView
      style={[styles.container, !isWeb && styles.nonWebBackground]}
      contentContainerStyle={styles.contentContainer}
    >
      <WebView>
        <Box marginBottom={12}>
          <Text fontSize="xl" fontWeight="bold">
            Profili juaj
          </Text>
        </Box>
        <Box>
          <Box marginBottom={12} gap={12} marginTop={12}>
            <Box flexDirection="row" gap={4}>
              <Label>Username:</Label>
              <Text fontWeight="bold">{data?.user?.username ?? username}</Text>
            </Box>
            <Box>
              <Label>Fjalëkalimi i vjetër</Label>
              <Controller
                control={form.control}
                name="oldPassword"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    placeholder="Fjalëkalimi juaj"
                    secureTextEntry
                    error={error?.message}
                    onChangeText={field.onChange}
                  />
                )}
              />
            </Box>
            <Box>
              <Label>Fjalëkalimi i ri</Label>
              <Controller
                control={form.control}
                name="newPassword"
                render={({ field, fieldState: { error } }) => (
                  <Input
                    {...field}
                    placeholder="Fjalëkalimi i ri"
                    secureTextEntry
                    error={error?.message}
                    onChangeText={field.onChange}
                  />
                )}
              />
            </Box>
            <Button variant="primary" onPress={form.handleSubmit(onSubmitHandler)} disabled={isPending}>
              {form.formState.isSubmitting ? (
                <Box flexDirection="row" gap={4}>
                  <Text>Duke ndryshuar...</Text>
                  <ActivityIndicator size="small" color="#000" />
                </Box>
              ) : (
                <Text>Modifiko të dhënat e profilit</Text>
              )}
            </Button>
            {mutationError && <Text style={styles.errorText}>{mutationError.message}</Text>}
            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </Box>
          <Modal
            onDismiss={() => setModalOpen(false)}
            visible={modalOpen}
            onRequestClose={() => setModalOpen(!modalOpen)}
            transparent
            presentationStyle="overFullScreen"
          >
            <TouchableOpacity
              onPressOut={() => setModalOpen(false)}
              onPressIn={() => undefined}
              activeOpacity={1}
              style={styles.modalOverlay}
            >
              <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                <Box marginBottom={8}>
                  <FontAwesome name="question" size={32} />
                </Box>
                <Text fontSize="lg" fontWeight="bold" style={styles.modalTitle}>
                  A jeni të sigurtë që dëshironi të dilni nga aplikacioni?
                </Text>
                <Text style={styles.modalDescription}>
                  Mund te hyni perseri ne cdo moment duke u kycur me kredencialet tuaja.
                </Text>
                <Box
                  marginTop={12}
                  gap={12}
                  flexDirection="row"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  style={styles.modalActions}
                >
                  <Button style={styles.flexOne} variant="tertiary" onPress={() => setModalOpen(false)}>
                    <Text>Jo, anulo</Text>
                  </Button>
                  <Button
                    style={styles.flexOne}
                    variant="danger"
                    onPress={() => {
                      setAuth(null, null, null);
                      queryClient.clear();
                      router.replace('/');
                    }}
                  >
                    <Text>Po, dil</Text>
                  </Button>
                </Box>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>
          <Box gap={12} marginTop={24}>
            <Text fontSize="md" fontWeight="bold">
              Veprime të tjera
            </Text>
            <Button variant="tertiary" onPress={() => router.push(`/your-listings`)}>
              Shiko listimet e mia
            </Button>
            <Button variant="danger" onPress={() => setModalOpen(true)}>
              Dil nga profili
            </Button>
          </Box>
        </Box>
      </WebView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nonWebBackground: {
    backgroundColor: 'white',
  },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  errorText: {
    color: Colors.danger,
    marginTop: 4,
  },
  modalOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    maxWidth: '90%',
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 120,
    alignSelf: 'center',
  },
  modalTitle: {
    textAlign: 'center',
  },
  modalDescription: {
    textAlign: 'center',
    marginTop: 12,
  },
  modalActions: {
    position: 'relative',
  },
  flexOne: {
    flex: 1,
  },
});
