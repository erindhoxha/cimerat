import { useLocalSearchParams } from 'expo-router';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Listing } from '@/types';
import { Loading } from '@/components/Loading/Loading';
import { MobileCarousel } from '@/components/MobileCarousel/MobileCarousel';
import { displayName, formatDate, formatKosovoPhone, listingHasExpired } from '@/utils';
import Colors from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { WebView } from '@/components/WebView/WebView';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ListingImage } from '@/components/ListingImage/ListingImage';
import { Avatar } from '@/components/Avatar/Avatar';
import { ContactButtons } from '@/components/ContactButtons/ContactButtons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Stat = ({ icon, label, value }: { icon: IconName; label: string; value?: string }) => (
  <Box style={styles.stat}>
    <Ionicons name={icon} size={16} color={Colors.text} />
    <Text style={styles.statValue}>{value && value !== 'undefined' ? value : '–'}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Box>
);

export default function ItemDetailScreen() {
  const { item, imageIndex } = useLocalSearchParams();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [heroIndex, setHeroIndex] = useState(typeof imageIndex === 'string' ? Math.round(Number(imageIndex)) || 0 : 0);
  const isMobile = useWindowDimensions().width < 768;

  const { token, userId } = useAuth();
  const isLoggedIn = !!token;
  const queryClient = useQueryClient();
  const router = useSafeRouter();

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
    enabled: typeof item === 'string' && item !== 'undefined',
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

  if (error) return <Text style={{ padding: 20 }}>{typeof error === 'string' ? error : error.message}</Text>;
  if (isLoading) return <Loading />;

  const isOwner = data?.user?._id === userId;
  const isExpired = listingHasExpired(data?.createdAt);
  const liked = userData?.user?.likedListings?.includes(data?._id as unknown as string);

  return data ? (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.contentContainer}>
      <WebView noPadding>
        <Box style={styles.hero}>
          <MobileCarousel<string>
            data={data.images}
            aspectRatio={4 / 3}
            defaultIndex={heroIndex}
            onProgressChange={setHeroIndex}
            renderItem={({ item, index }) => (
              <Pressable style={styles.heroSlide} onPress={() => setLightboxIndex(index)}>
                <ListingImage
                  path={item}
                  width={1200}
                  blurhash={data?.blurhashes?.[index] || data?.blurhash}
                  style={styles.cardImage}
                  priority={index === heroIndex ? 'high' : 'normal'}
                />
              </Pressable>
            )}
          />
          {data.images.length > 1 && (
            <Box style={styles.heroCounter} pointerEvents="none">
              <Text style={styles.heroCounterText}>
                {heroIndex + 1}/{data.images.length}
              </Text>
            </Box>
          )}
        </Box>

        <Box style={styles.body}>
          <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between" gap={12}>
            <Box style={styles.contentInner}>
              <Text style={styles.title} numberOfLines={2}>
                {data.neighborhood}
              </Text>
              <Box flexDirection="row" alignItems="center" gap={6} marginTop={4}>
                <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
                <Text style={styles.muted}>{data.city}</Text>
              </Box>
            </Box>

            {!isOwner && (
              <Pressable
                onPress={() => (!isLoggedIn ? router.push('/login') : like(data._id))}
                style={({ pressed }) => [
                  styles.likeButton,
                  liked && styles.likeButtonActive,
                  pressed && styles.likeButtonPressed,
                ]}
                accessibilityLabel={liked ? 'Hiq nga të preferuarat' : 'Shto te të preferuarat'}
              >
                {status === 'pending' ? (
                  <ActivityIndicator size="small" color={Colors.accent} />
                ) : (
                  <Ionicons
                    name={liked ? 'heart' : 'heart-outline'}
                    size={20}
                    color={liked ? Colors.accent : Colors.text}
                  />
                )}
              </Pressable>
            )}
          </Box>

          <Box flexDirection="row" alignItems="baseline" gap={8}>
            <Text style={styles.price}>
              {data.price}€<Text style={styles.priceUnit}> /muaj</Text>
            </Text>
            {isExpired && (
              <Box style={styles.expiredBadge}>
                <Text style={styles.expiredText}>Skaduar</Text>
              </Box>
            )}
          </Box>

          <Box style={styles.stats}>
            <Stat icon="bed-outline" label="Dhoma" value={data.rooms} />
            <Box style={styles.statDivider} />
            <Stat icon="person-outline" label="Cimerë" value={data.currentFlatmates} />
            <Box style={styles.statDivider} />
            <Stat
              icon={
                data.flatmateGender === 'Mashkull'
                  ? 'male'
                  : data.flatmateGender === 'Femër'
                    ? 'female'
                    : 'people-outline'
              }
              label="Gjinia"
              value={data.flatmateGender}
            />
          </Box>

          <Box gap={8}>
            <Text style={styles.sectionTitle}>Përshkrimi</Text>
            <Text style={styles.description}>
              {data.description || 'Përshkrimi i listimit nuk është i disponueshëm'}
            </Text>
          </Box>

          <Pressable
            style={({ pressed }) => [styles.author, pressed && styles.pressed]}
            onPress={() => router.push(`/user/${data.user._id}`)}
          >
            <Avatar user={data.user} size={44} linked={false} />
            <Box flex={1}>
              <Text style={styles.authorName}>{displayName(data.user)}</Text>
              {data.createdAt && <Text style={styles.muted}>Postuar më {formatDate(data.createdAt)}</Text>}
            </Box>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </Pressable>

          {data.phone && !isOwner && (
            <Box gap={8}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="baseline">
                <Text style={styles.sectionTitle}>Kontakto</Text>
                <Text style={styles.muted} selectable>
                  {formatKosovoPhone(data.phone)}
                </Text>
              </Box>
              <ContactButtons
                phone={data.phone}
                message={`Përshëndetje, pashë listimin tuaj në Cimerat (${data.neighborhood}, ${data.city}). A është ende i lirë?`}
              />
            </Box>
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

              <ListingImage
                style={styles.lightboxImage}
                contentFit="contain"
                path={data.images[lightboxIndex ?? 0]}
                blurhash={data.blurhashes?.[lightboxIndex ?? 0]}
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
              <ListingImage
                style={styles.lightboxImage}
                contentFit="contain"
                path={data.images[lightboxIndex]}
                blurhash={data.blurhashes?.[lightboxIndex]}
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

  hero: { width: '100%', position: 'relative' },
  heroSlide: { width: '100%', height: '100%' },
  heroCounter: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  heroCounterText: { color: 'white', fontSize: 12, fontWeight: '600' },
  cardImage: { width: '100%', height: '100%' },

  body: {
    width: '100%',
    padding: 20,
    paddingBottom: 48,
    gap: 20,
    backgroundColor: Colors.surface,
  },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5, color: Colors.text },
  muted: { fontSize: 14, color: Colors.textMuted },
  price: { fontSize: 28, fontWeight: '800', letterSpacing: -0.6, color: Colors.text },
  priceUnit: { fontSize: 15, fontWeight: '500', color: Colors.textMuted },

  stats: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingVertical: 14,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  statValue: { fontSize: 15, fontWeight: '700', color: Colors.text, marginTop: 2 },
  statLabel: { fontSize: 12, color: Colors.textMuted },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  description: { fontSize: 15, lineHeight: 22, color: Colors.textFade },

  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  authorName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  pressed: { opacity: 0.7 },

  likeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButtonActive: { backgroundColor: Colors.accentSoft, borderColor: Colors.accentSoft },
  likeButtonPressed: { opacity: 0.7 },

  expiredBadge: {
    backgroundColor: Colors.dangerSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  expiredText: { fontSize: 12, fontWeight: '700', color: Colors.danger },

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
