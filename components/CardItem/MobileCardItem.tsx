import { useState } from 'react';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '../Box';
import { Text } from '../Text';
import { OwnerActions } from '../OwnerActions/OwnerActions';
import { useDeleteListing } from '@/hooks/useDeleteListing';
import { MobileCarousel } from '@/components/MobileCarousel/MobileCarousel';
import { ListingImage } from '@/components/ListingImage/ListingImage';
import { Avatar } from '@/components/Avatar/Avatar';
import { useAuth } from '@/context/AuthContext';
import { formatDate, listingHasExpired } from '@/utils';
import { Listing } from '@/types';
import Colors from '@/constants/Colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const isSet = (value?: string | number) =>
  value !== undefined && value !== null && value !== '' && value !== 'undefined';

export const Feature = ({ icon, label }: { icon: IconName; label: string }) => (
  <Box style={styles.feature}>
    <Ionicons name={icon} size={12} color={Colors.textMuted} />
    <Text style={styles.featureText}>{label}</Text>
  </Box>
);

export const MobileCardItem = ({
  city,
  neighborhood,
  images,
  user,
  price,
  _id,
  createdAt,
  currentFlatmates,
  flatmateGender,
  rooms,
  blurhash,
  blurhashes,
}: Listing) => {
  const router = useSafeRouter();
  const { userId } = useAuth();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const isOwner = user?._id === userId;
  const isExpired = listingHasExpired(createdAt);
  const confirmDelete = useDeleteListing();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() =>
        router.push({
          pathname: `/(item)/[item]`,
          params: { imageIndex: carouselIndex, item: _id },
        })
      }
    >
      <Box style={styles.media}>
        <MobileCarousel<string>
          aspectRatio={3 / 2}
          controlledIndex={carouselIndex}
          data={images}
          onProgressChange={setCarouselIndex}
          renderItem={({ item, index }) => (
            <ListingImage path={item} blurhash={blurhashes?.[index] || blurhash} style={styles.cardImage} width={800} />
          )}
        />
        <Box style={styles.badges} pointerEvents="none">
          {isExpired && (
            <Box style={[styles.badge, styles.badgeExpired]}>
              <Text style={styles.badgeExpiredText}>Skaduar</Text>
            </Box>
          )}
          {isOwner && (
            <Box style={styles.badge}>
              <Text style={styles.badgeText}>Listimi yt</Text>
            </Box>
          )}
        </Box>
        {!!user && (
          <Box style={styles.posterAvatar}>
            <Avatar user={user} size={36} />
          </Box>
        )}
      </Box>

      <Box style={styles.content}>
        <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap={12}>
          <Box flex={1}>
            <Text style={styles.title} numberOfLines={1}>
              {neighborhood}
            </Text>
            <Box flexDirection="row" alignItems="center" gap={6} marginTop={2}>
              <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.subtitle} numberOfLines={1}>
                {city}
                {createdAt ? ` · ${formatDate(createdAt)}` : ''}
              </Text>
            </Box>
          </Box>
          <Text style={styles.price}>
            {price}€<Text style={styles.priceUnit}> /muaj</Text>
          </Text>
        </Box>

        {(isSet(rooms) || isSet(currentFlatmates) || isSet(flatmateGender)) && (
          <Box flexDirection="row" gap={8} flexWrap="wrap" marginTop={12}>
            {isSet(rooms) && <Feature icon="bed-outline" label={`${rooms} dhoma`} />}
            {isSet(currentFlatmates) && <Feature icon="person-outline" label={`${currentFlatmates} cimerë`} />}
            {isSet(flatmateGender) && (
              <Feature
                icon={flatmateGender === 'Mashkull' ? 'male' : flatmateGender === 'Femër' ? 'female' : 'people-outline'}
                label={flatmateGender as string}
              />
            )}
          </Box>
        )}
      </Box>
      {isOwner && (
        <Box style={styles.ownerBar}>
          <OwnerActions
            onEdit={() => router.push(`/edit/${_id}`)}
            editDisabled={isExpired}
            onDelete={() => confirmDelete(_id)}
          />
        </Box>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
  },
  media: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  ownerBar: {
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
  },
  posterAvatar: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  badgeExpired: {
    backgroundColor: Colors.danger,
  },
  badgeExpiredText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    flexShrink: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  priceUnit: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textFade,
  },
});
