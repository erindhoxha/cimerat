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
import { ReusableCarousel } from '@/components/Carousel/Carousel';
import { formatKosovoPhone } from '@/utils';

export default function ItemDetailScreen() {
  const { item, imageIndex } = useLocalSearchParams();

  const { token, userId } = useAuth();

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

  if (isLoading) {
    return <Loading />;
  }

  const isOwner = listing?.data?.user?._id === userId;

  return (
    data && (
      <Box flex={1} style={styles.container}>
        <ReusableCarousel
          data={data.images}
          defaultIndex={typeof imageIndex === 'string' ? Math.round(Number(imageIndex)) : 0}
          renderItem={({ item, index }) => {
            return (
              <ExpoImage
                style={styles.cardImage}
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_URL}${item}`,
                }}
                placeholder={{ blurhash: data?.blurhashes?.[index] || data?.blurhash || '' }}
                contentFit="cover"
                transition={BLURHASH_TRANSITION}
              />
            );
          }}
        />
        <Box flex={1} paddingHorizontal={20} gap={12}>
          <Box flexDirection="column" justifyContent="space-between" gap={4} marginTop={20} alignItems="flex-start">
            {data.user.verified && (
              <Box flexDirection="row" gap={8} marginBottom={8}>
                <Pill
                  title={'Personi i verifikuar'}
                  variant="yellow"
                  iconLeft={<FontAwesome name="check" size={12} color="#000" />}
                />
              </Box>
            )}
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
              {data.phone && (
                <Text>
                  Tel:{' '}
                  <Text
                    style={styles.link}
                    onPress={() => {
                      Linking.openURL(`tel:${formatKosovoPhone(data.phone)}`);
                    }}
                  >
                    {formatKosovoPhone(data.phone)}
                  </Text>
                </Text>
              )}
            </>
          ) : (
            <>
              <Button
                onPress={() => {
                  router.navigate('/login');
                }}
              >
                <FontAwesome name="user-circle-o" size={16} /> Kyçu për të kontaktuar
              </Button>
            </>
          )}
          {isOwner && <Button onPress={() => router.push(`/edit/${data._id}`)}>Ndrysho listimin</Button>}
        </Box>
      </Box>
    )
  );
}

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: 300,
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
