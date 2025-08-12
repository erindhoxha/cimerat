import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, StyleSheet } from 'react-native';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/types';
import { Loading } from '@/components/Loading/Loading';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BLURHASH_TRANSITION } from '@/constants/global';
import { Pill } from '@/components/Pill/Pill';

export default function ItemDetailScreen() {
  const { item } = useLocalSearchParams();

  const { token } = useAuth();

  const isLoggedIn = !!token;

  const router = useRouter();

  const listing = useQuery<Listing>({
    staleTime: 0,
    queryKey: ['listing', item],
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listing/${item}`);
      if (!res.ok) {
        throw new Error('Failed to fetch listings');
      }
      return res.json();
    },
  });

  const { data, error, isLoading } = listing;

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  console.log(data?.blurhash);

  if (isLoading) {
    return <Loading />;
  }

  return (
    data && (
      <Box flex={1} style={styles.container}>
        <ExpoImage
          style={styles.cardImage}
          source={{
            uri: `${process.env.EXPO_PUBLIC_API_URL}${data.images[0]}`,
          }}
          placeholder={{
            blurhash: data?.blurhash || '',
          }}
          transition={BLURHASH_TRANSITION}
          contentFit="cover"
        />
        <Box flex={1} paddingHorizontal={20} gap={12}>
          <Box flexDirection="column" justifyContent="space-between" gap={4} alignItems="flex-start">
            <Box flexDirection="row" gap={8} marginBottom={8}>
              <Pill
                title="Personi i verifikuar"
                variant="yellow"
                iconLeft={<FontAwesome name="check" size={12} color="#000" />}
              />
            </Box>
            <Text fontSize="xl" fontWeight="bold" style={{ flexShrink: 1 }}>
              {data.city}, {data.neighborhood}
            </Text>
            <Text>{data.price}€ për muaj</Text>
          </Box>

          <Text>{data.description || 'Përshkrimi i listimit nuk është i disponueshëm'}</Text>
          {isLoggedIn ? (
            <>
              <Box>
                <Text>
                  Postuar nga <Text fontWeight="bold">{data.user.username}</Text>
                </Text>
              </Box>
              <Text>
                Tel:{' '}
                <Text
                  style={styles.link}
                  onPress={() => {
                    Linking.openURL('tel:+38348377390');
                  }}
                >
                  +383 (48) 377 390
                </Text>
              </Text>
              <Text>
                Email:{' '}
                <Text
                  style={styles.link}
                  onPress={() => {
                    Linking.openURL('mailto:erind.cbh@gmail.com');
                  }}
                >
                  erind.cbh@gmail.com
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                onPress={() => {
                  router.navigate('/login');
                }}
              >
                <FontAwesome name="user-circle-o" size={16} /> Kyçu për të kontaktuar
              </Button>
            </>
          )}
        </Box>
      </Box>
    )
  );
}

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    height: '100%',
  },
  link: {
    color: Colors.blue,
    textDecorationLine: 'underline',
  },
});
