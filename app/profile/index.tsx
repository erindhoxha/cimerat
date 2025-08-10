import { Box } from '@/components/Box';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { Text } from '@/components/Text';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, StyleSheet } from 'react-native';
import Input from '@/components/Input';
import Label from '@/components/Label';
import { useState } from 'react';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const { token } = useAuth();

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

  const [name, setName] = useState(data?.user?.username || undefined);

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

  const {
    user: { username },
  } = data;

  return (
    <ScrollView style={styles.container}>
      <Box marginBottom={12}>
        <Text fontSize="xl" fontWeight="bold">
          Përshendetje, {username}
        </Text>
      </Box>
      <Box>
        <Box marginBottom={12} gap={12}>
          <Text fontSize="md" fontWeight="bold">
            Ndrysho të dhënat e profilit
          </Text>
          <Box>
            <Label>Emri</Label>
            <Input placeholder="Emri juaj" value={name ?? username} onChangeText={setName} />
          </Box>
          <Box>
            <Label>Email</Label>
            <Input placeholder="Email" />
          </Box>
          <Box>
            <Label>Numri i telefonit</Label>
            <Input placeholder="Numri i telefonit" />
          </Box>
          <Button variant="primary" onPress={() => {}}>
            Ndrysho të dhënat
          </Button>
        </Box>
        <Box gap={12} marginTop={24} borderTopWidth={1} paddingTop={24} borderColor={Colors.lightGray}>
          <Text fontSize="md" fontWeight="bold">
            Ndrysho fjalëkalimin
          </Text>
          <Box>
            <Label>Fjalëkalimi i vjetër</Label>
            <Input placeholder="Fjalëkalimi juaj" secureTextEntry />
          </Box>
          <Box>
            <Label>Fjalëkalimi i ri</Label>
            <Input placeholder="Fjalëkalimi i ri" secureTextEntry />
          </Box>
          <Button variant="tertiary" onPress={() => {}}>
            Ndrysho fjalëkalimin
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
});
