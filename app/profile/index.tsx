import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/Text';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from 'react-native';
import Input from '@/components/Input';
import Label from '@/components/Label';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { FieldValues } from 'react-hook-form';
import Toast from 'react-native-toast-message';

interface Mutation {
  userId: string | null;
  username: string;
  password: string;
  oldPassword: string;
}

export default function ProfileScreen() {
  const { token, userId, setAuth } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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
        throw new Error('Failed to fetch user data');
      }
      return res.json();
    },
  });

  const { mutateAsync: updateMutation, error: mutationError } = useMutation({
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
        throw new Error(json.error || 'Gabim gjatë kyçjes. Ju lutemi provoni përsëri.');
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

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Text>Error: {error.message}</Text>
      </Box>
    );
  }

  const queryClient = useQueryClient();

  const {
    user: { username },
  } = data;

  const onSubmitHandler = async (data: FieldValues) => {
    setLoading(true);
    await updateMutation(
      {
        userId,
        username: data?.user?.username ?? username,
        oldPassword,
        password: newPassword,
      },
      {
        onSuccess(data) {
          Toast.show({ type: 'success', text1: 'Përdoruesi u përditësua me sukses' });
          router.push('/');
        },
        onSettled() {
          setLoading(false);
        },
      },
    );
  };
  return (
    <ScrollView style={styles.container}>
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
            <Input placeholder="Fjalëkalimi juaj" secureTextEntry value={oldPassword} onChangeText={setOldPassword} />
          </Box>
          <Box>
            <Label>Fjalëkalimi i ri</Label>
            <Input placeholder="Fjalëkalimi i ri" secureTextEntry value={newPassword} onChangeText={setNewPassword} />
          </Box>
          <Button variant="primary" onPress={onSubmitHandler}>
            {loading ? (
              <Box flexDirection="row" gap={4}>
                <Text>Duke ndryshuar...</Text>
                <ActivityIndicator size="small" color="#000" />
              </Box>
            ) : (
              <Text>Modifiko të dhënat e profilit</Text>
            )}
          </Button>
          {mutationError && <Text style={styles.errorText}>Error: {mutationError.message}</Text>}
        </Box>
        <Box gap={12} marginTop={24}>
          <Text fontSize="md" fontWeight="bold">
            Veprime të tjera
          </Text>
          <Button variant="tertiary" onPress={() => router.push(`/your-listings`)}>
            Shiko listimet e mia
          </Button>
          <Button
            variant="danger"
            onPress={() => {
              Alert.alert('Dalja', 'A jeni i sigurt që doni të dilni?', [
                {
                  text: 'Anulo',
                  style: 'cancel',
                },
                {
                  text: 'Dil',
                  style: 'destructive',
                  onPress: () => {
                    setAuth(null, null, null);
                    queryClient.clear();
                    router.replace('/');
                  },
                },
              ]);
            }}
          >
            Dil nga profili
          </Button>
        </Box>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  errorText: {
    color: Colors.danger,
    marginTop: 4,
  },
  linkButton: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 6,
    borderColor: 'white',
    marginBottom: 12,
  },
});
