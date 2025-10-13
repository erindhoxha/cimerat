import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ViewStyle,
} from 'react-native';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Listing } from '@/types';
import { Loading } from '@/components/Loading/Loading';
import { BLURHASH_TRANSITION } from '@/constants/global';
import { MobileCarousel } from '@/components/MobileCarousel/MobileCarousel';
import { formatDate, formatKosovoPhone, listingHasExpired } from '@/utils';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { WebView } from '@/components/WebView/WebView';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { WebCarousel } from '@/components/WebCarousel/WebCarousel';

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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        return Promise.reject('Gjetja e listimeve ishte e pasuksesshme nga ana jonë.');
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
      if (!res.ok) {
        return Promise.reject('Pëlqimi i listimit ishte i pasuksesshëm nga ana jonë.');
      }
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
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to like listing' });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['liked-listings'] });
    },
  });

  const { data, error, isLoading } = useQuery<Listing>({
    staleTime: 0,
    queryKey: ['listing', item],
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/listing/${item}`);
      if (!res.ok) {
        return Promise.reject('Gjetja e listimit ishte i pasuksesshëm nga ana jonë.');
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (lightboxIndex === null || !data) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev === 0 ? data.images.length - 1 : (prev ?? 0) - 1));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === data.images.length - 1 ? 0 : (prev ?? 0) + 1));
      }
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };
  }, [lightboxIndex, data?.images.length]);

  if (error) return <Text>Error: {error.message}</Text>;
  if (isLoading) return <Loading />;

  const isOwner = data?.user?._id === userId;
  const isExpired = listingHasExpired(data?.createdAt);
  const liked = userData?.user?.likedListings?.includes(data?._id as unknown as string);

  const isSingle = data?.images.length === 1;

  return data ? (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
      <WebView noPadding>
        <Pressable onPress={() => setLightboxIndex(0)}>
          <MobileCarousel
            style={[styles.carousel]}
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
        </Pressable>
        <Box flex={1} paddingHorizontal={20} gap={12}>
          <Box flexDirection="column" gap={4} marginTop={isSingle ? 20 : 12} alignItems="flex-start">
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" width="100%">
              <Box style={styles.contentInner}>
                <Text>
                  Postuar nga <Text fontWeight="bold">{data.user.username}</Text>
                </Text>
                <Box marginVertical={8}>
                  <Text fontSize="xl" fontWeight="bold" numberOfLines={1} ellipsizeMode="tail">
                    {data.city}, {data.neighborhood}
                  </Text>
                </Box>
              </Box>

              {!isOwner && (
                <Pressable
                  onPress={() => (!isLoggedIn ? router.push('/login') : like(data._id))}
                  style={({ pressed }) => [styles.likeButton, pressed && styles.likeButtonPressed]}
                >
                  {status === 'pending' ? (
                    <ActivityIndicator size={24} color={Colors.yellow} />
                  ) : (
                    <FontAwesome name={liked ? 'heart' : 'heart-o'} size={24} color={Colors.yellow} />
                  )}
                </Pressable>
              )}
            </Box>

            {isExpired ? (
              <Text style={styles.expiredText}>Listimi është skaduar</Text>
            ) : (
              <Text>
                <Text fontWeight="bold">Çmimi:</Text> {data.price}€ për muaj
              </Text>
            )}
          </Box>

          {data.createdAt && (
            <Text>
              <Text fontWeight="bold">Data e postimit:</Text> {formatDate(data.createdAt)}
            </Text>
          )}
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
                  if (await Linking.canOpenURL(url)) Linking.openURL(url);
                  else console.warn("Can't handle tel link");
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
      {isMobile && (
        <Modal visible={lightboxIndex !== null} transparent animationType="fade">
          <Pressable style={styles.lightboxWrapper} onPress={() => setLightboxIndex(null)}>
            <Box
              style={{
                position: 'relative',
                width: '90%',
                height: '80%',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {data.images.length > 1 && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(lightboxIndex === 0 ? data.images.length - 1 : (lightboxIndex ?? 0) - 1);
                  }}
                  style={styles.lightboxArrowLeft}
                >
                  <Text style={{ color: 'white', fontSize: 36, lineHeight: 36 }}>{'‹'}</Text>
                </TouchableOpacity>
              )}

              <ExpoImage
                style={styles.lightboxImage}
                contentFit="contain"
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${data.images[lightboxIndex ?? 0]}` }}
              />

              {data.images.length > 1 && (
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(lightboxIndex === data.images.length - 1 ? 0 : (lightboxIndex ?? 0) + 1);
                  }}
                  style={styles.lightboxArrowRight}
                >
                  <Text style={{ color: 'white', fontSize: 36, lineHeight: 36 }}>{'›'}</Text>
                </TouchableOpacity>
              )}

              <Text style={styles.imageCounter}>
                {(lightboxIndex ?? 0) + 1} / {data.images.length}
              </Text>
            </Box>
            <Text style={styles.lightboxHint}>(prek kudo për të mbyllur)</Text>
          </Pressable>
        </Modal>
      )}
      {lightboxIndex !== null &&
        !isMobile &&
        createPortal(
          <Pressable onPress={() => setLightboxIndex(null)} style={styles.lightboxWrapper}>
            <Box style={styles.lightboxInner}>
              {data.images.length > 1 && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(lightboxIndex === 0 ? data.images.length - 1 : lightboxIndex - 1);
                  }}
                  style={styles.lightboxArrowLeft}
                >
                  <Text style={{ color: 'white', fontSize: 42, lineHeight: 42 }}>{'‹'}</Text>
                </Pressable>
              )}
              <ExpoImage
                style={styles.lightboxImage}
                contentFit="contain"
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${data.images[lightboxIndex]}` }}
              />

              {/* Right arrow */}
              {data.images.length > 1 && (
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(lightboxIndex === data.images.length - 1 ? 0 : lightboxIndex + 1);
                  }}
                  style={styles.lightboxArrowRight}
                >
                  <Text style={{ color: 'white', fontSize: 42, lineHeight: 42 }}>{'›'}</Text>
                </Pressable>
              )}

              {/* Image counter at the bottom center */}
              <Text style={styles.imageCounter}>
                {lightboxIndex + 1} / {data.images.length}
              </Text>
            </Box>
            <Text style={styles.lightboxHint}>(prek kudo për të mbyllur)</Text>
          </Pressable>,
          document.body,
        )}
    </ScrollView>
  ) : null;
}

const styles = StyleSheet.create({
  scrollViewContainer: { flex: 1, height: '100%', backgroundColor: 'white' },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  contentInner: { flexShrink: 1, flexGrow: 1, minWidth: 0 },

  carousel: { width: '100%', userSelect: 'all' },
  cardImage: { width: '100%', height: '100%', aspectRatio: 2, marginBottom: 20 },

  webGallery: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    overflow: 'hidden',
    maxHeight: '100%',
    padding: 8,
  },
  webGallerySingle: { padding: 0 },
  webGalleryImage: { overflow: 'hidden', backgroundColor: '#eee' },

  likeButton: { borderRadius: 8, padding: 8, marginLeft: 8 },
  likeButtonPressed: { backgroundColor: '#eee', opacity: 0.7 },

  expiredText: { fontSize: 14, fontWeight: 'bold', color: 'red' },
  link: { color: Colors.blue, textDecorationLine: 'underline' },

  lightboxInner: {
    position: 'relative',
    width: '90%',
    height: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightboxHint: { color: 'white', marginTop: 10 },
  lightboxWrapper: {
    position: 'fixed', // for web
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  lightboxImage: {
    width: '90%',
    height: '80%',
    borderRadius: 16,
  },
  lightboxArrowLeft: {
    position: 'absolute',
    left: 28,
    top: '50%',
    transform: [{ translateY: -20 }],
    zIndex: 200,
    paddingHorizontal: 12,
    paddingVertical: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 150,
  },
  lightboxArrowRight: {
    position: 'absolute',
    right: 28,
    top: '50%',
    transform: [{ translateY: -20 }],
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    zIndex: 10,
  },
});
