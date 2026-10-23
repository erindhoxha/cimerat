import { Pressable, StyleSheet } from 'react-native';
import { Router } from 'expo-router';
import { Text } from '../Text';
import Colors from '@/constants/Colors';
import { Box } from '../Box';
import { OwnerActions } from '../OwnerActions/OwnerActions';
import { useDeleteListing } from '@/hooks/useDeleteListing';
import { ListingImage } from '../ListingImage/ListingImage';
import { Listing } from '@/types';
import { formatDate, listingHasExpired } from '@/utils';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface HorizontalCardItemProps {
  item: Listing;
  router: Router;
  liked: boolean;
}

export const HorizontalCardItem = ({
  item: { images, _id, city, neighborhood, createdAt, price, description, blurhash, user },
  router,
  liked,
}: HorizontalCardItemProps) => {
  const { userId } = useAuth();
  const isOwner = user?._id === userId;
  const isExpired = listingHasExpired(createdAt);
  const confirmDelete = useDeleteListing();

  return (
    <Box style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.listCard, pressed && styles.pressed]}
        onPress={() => router.push(`/${_id}`)}
      >
        <Box style={styles.cardWrapper}>
          <ListingImage path={images[0]} blurhash={blurhash} style={styles.cardImage} />
          {liked && (
            <Box style={styles.liked}>
              <Ionicons name="heart" size={12} color={Colors.accent} />
            </Box>
          )}
          {images?.length > 1 && <Text style={styles.imageCounter}>+{images.length - 1}</Text>}
        </Box>
        <Box style={styles.cardContent}>
          <Box flexDirection="row" justifyContent="space-between" alignItems="flex-start" gap={8}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {neighborhood}
            </Text>
            <Text style={styles.price}>{price}€</Text>
          </Box>
          <Text style={styles.meta} numberOfLines={1}>
            {city}
            {createdAt ? ` · ${formatDate(createdAt)}` : ''}
          </Text>
          {isExpired ? (
            <Text style={styles.expiredText}>Listimi është skaduar</Text>
          ) : (
            <Text numberOfLines={1} style={styles.cardDescription} ellipsizeMode="tail">
              {description}
            </Text>
          )}
        </Box>
      </Pressable>
      {isOwner && (
        <OwnerActions
          onEdit={() => router.push(`/edit/${_id}`)}
          editDisabled={isExpired}
          onDelete={() => confirmDelete(_id)}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  listCard: {
    flexDirection: 'row',
    gap: 14,
    padding: 10,
  },
  pressed: {
    opacity: 0.9,
  },
  cardWrapper: {
    width: 96,
    height: 96,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 2,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  meta: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: Colors.textFade,
    marginTop: 6,
  },
  expiredText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
    marginTop: 6,
  },
  liked: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 8,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
