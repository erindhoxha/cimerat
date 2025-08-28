import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Listing } from '@/types';
import { Loading } from '@/components/Loading/Loading';
import { Pill } from '@/components/Pill/Pill';
import { BLURHASH_TRANSITION } from '@/constants/global';
import { ReusableCarousel } from '@/components/Carousel/Carousel';
import { formatDate, formatKosovoPhone, listingHasExpired } from '@/utils';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { WebView } from '@/components/WebView/WebView';
import { useState } from 'react';
import { createPortal } from 'react-dom';

export default function ItemDetailScreen() {
  const { item, imageIndex } = useLocalSearchParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isMobile = useWindowDimensions().width < 768;

  const { token, userId } = useAuth();

  const isLoggedIn = !!token;

  const queryClient = useQueryClient();

  const router = useRouter();

  const { data: userData } = useQuery({
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

  const { mutate: like, status } = useMutation({
    mutationFn: async (listingId: string) => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listing/${listingId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Failed to like listing');
      return res.json();
    },
    onMutate: async (listingId: string) => {
      await queryClient.cancelQueries({ queryKey: ['user'] });

      const previousUser = queryClient.getQueryData<any>(['user']);

      queryClient.setQueryData(['user'], (old: any) => {
        if (!old?.user) return old;
        const likedListings = old.user.likedListings || [];
        const alreadyLiked = likedListings.includes(listingId);
        return {
          ...old,
          user: {
            ...old.user,
            likedListings: alreadyLiked
              ? likedListings.filter((id: string) => id !== listingId)
              : [...likedListings, listingId],
          },
        };
      });
      return { previousUser };
    },
    onError: (_, __, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user'], context.previousUser);
      }
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to like listing',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['liked-listings'] });
    },
  });

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
  const isExpired = listingHasExpired(data?.createdAt);
  const liked = userData?.user?.likedListings?.includes(data?._id as unknown as Listing);

  const isWeb = Platform.OS === 'web';
  const isSingle = data?.images.length === 1;

  return (
    data && (
      <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
        <WebView noPadding>
          {isWeb && !isMobile ? (
            <Box
              style={{
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                padding: isSingle ? 0 : 8,
              }}
            >
              {data.images?.map((img: string, index: number) => {
                const isLast = index === data.images.length - 1;
                return (
                  <Pressable
                    key={img.toString() + index}
                    onPress={() => setLightboxIndex(index)}
                    style={{ flexBasis: isLast || isSingle ? '100%' : '32%', flexGrow: 1 }}
                  >
                    <ExpoImage
                      style={{
                        width: '100%',
                        height: isLast || isSingle ? 320 : 200,
                        borderRadius: isSingle ? 0 : 8, // softer radius
                      }}
                      source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${img}` }}
                      placeholder={{ blurhash: data?.blurhashes?.[index] || data?.blurhash || '' }}
                      contentFit="cover"
                      transition={BLURHASH_TRANSITION}
                    />
                  </Pressable>
                );
              })}
            </Box>
          ) : (
            <ReusableCarousel
              style={{
                maxHeight: 320,
                width: '100%',
              }}
              data={data.images}
              defaultIndex={typeof imageIndex === 'string' ? Math.round(Number(imageIndex)) : 0}
              renderItem={({ item, index }) => (
                <ExpoImage
                  key={index}
                  style={styles.cardImage}
                  source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${item}` }}
                  placeholder={{ blurhash: data?.blurhashes?.[index] || data?.blurhash || '' }}
                  contentFit="cover"
                  transition={BLURHASH_TRANSITION}
                />
              )}
            />
          )}
          <Box flex={1} paddingHorizontal={20} gap={12}>
            <Box
              flexDirection="column"
              justifyContent="space-between"
              gap={4}
              marginTop={isSingle ? 20 : 12}
              alignItems="flex-start"
            >
              {data.user.verified && (
                <Box flexDirection="row" gap={8} marginBottom={8}>
                  <Pill
                    title={'Personi i verifikuar'}
                    variant="yellow"
                    iconLeft={<FontAwesome name="check" size={12} color="#000" />}
                  />
                </Box>
              )}
              <Box flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
                <Box style={{ flexShrink: 1, flexGrow: 1, minWidth: 0 }}>
                  <Box>
                    <Text>
                      Postuar nga <Text fontWeight="bold">{data.user.username}</Text>
                    </Text>
                  </Box>
                  <Box marginTop={8} marginBottom={8}>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{ minWidth: 0 }}
                    >
                      {data.city}, {data.neighborhood}
                    </Text>
                  </Box>
                </Box>
                {!isOwner && (
                  <Pressable
                    onPress={() => {
                      if (!isLoggedIn) {
                        router.push('/login');
                      } else {
                        like(data._id);
                      }
                    }}
                    style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? '#eee' : 'transparent',
                        opacity: pressed ? 0.7 : 1,
                        borderRadius: 8,
                        padding: 8,
                        marginLeft: 8,
                      },
                    ]}
                  >
                    <Box>
                      {status === 'pending' ? (
                        <ActivityIndicator size={24} color={Colors.yellow} />
                      ) : (
                        <FontAwesome name={liked ? 'heart' : 'heart-o'} size={24} color={Colors.yellow} />
                      )}
                    </Box>
                  </Pressable>
                )}
              </Box>
              {isExpired ? (
                <Text style={styles.expiredText}>❌ Skaduar</Text>
              ) : (
                <Text>
                  <Text fontWeight="bold">Çmimi:</Text> {data.price}€ për muaj
                </Text>
              )}
            </Box>
            <Box flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
              {data.createdAt && (
                <Text>
                  <Text fontWeight="bold">Data e postimit:</Text> {formatDate(data.createdAt)}
                </Text>
              )}
            </Box>
            <Text>
              <Text fontWeight="bold">Numri i Dhomave: </Text>
              {data.rooms || 'Nuk është cekur'}
            </Text>
            <Text>
              <Text fontWeight="bold">Numri i Cimerave: </Text>
              {data.currentFlatmates || 'Nuk është cekur'}
            </Text>
            <Text>
              <Text fontWeight="bold">Gjinia e preferuar: </Text>
              {data.flatmateGender || 'Nuk është cekur'}
            </Text>
            <Text>
              <Text fontWeight="bold">Mesazhi: </Text>
              {data.description || 'Përshkrimi i listimit nuk është i disponueshëm'}
            </Text>
            {data.phone && (
              <Text>
                <Text fontWeight="bold">Numri i telefonit: </Text>
                <Text
                  style={styles.link}
                  accessibilityRole="link"
                  onPress={async () => {
                    const url = `tel:${formatKosovoPhone(data.phone)}`;
                    const supported = await Linking.canOpenURL(url);
                    if (supported) {
                      Linking.openURL(url);
                    } else {
                      console.warn("Can't handle tel link");
                    }
                  }}
                >
                  {formatKosovoPhone(data.phone)}
                </Text>
              </Text>
            )}
            {isOwner && (
              <Button
                variant={isExpired ? 'secondary' : 'primary'}
                disabled={isExpired}
                onPress={() => router.push(`/edit/${data._id}`)}
              >
                Modifiko listimin
              </Button>
            )}
          </Box>
        </WebView>
        {lightboxIndex !== null &&
          createPortal(
            <Pressable
              onPress={() => setLightboxIndex(null)}
              style={{
                position: 'fixed', // works on web
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <ExpoImage
                style={{
                  width: '90%',
                  height: '80%',
                  borderRadius: 24,
                  overflow: 'hidden',
                }}
                contentFit="contain"
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${data.images[lightboxIndex]}` }}
              />
              <Text style={{ color: 'white', marginTop: 10 }}>(prek kudo për të mbyllur)</Text>
            </Pressable>,
            document.body,
          )}
      </ScrollView>
    )
  );
}

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 2,
    marginBottom: 20,
  },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  expiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
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
  scrollViewContainer: {
    flex: 1,
    height: '100%',
    backgroundColor: 'white',
  },
});
