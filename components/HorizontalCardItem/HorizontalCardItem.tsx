import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { View } from '../View/View';
import { Router } from 'expo-router';
import { Text } from '../Text';
import Colors from '@/constants/Colors';
import { Box } from '../Box';
import { Button } from '../Button';
import { Listing } from '@/types';
import { formatDate, listingHasExpired } from '@/utils';
import { BLURHASH_TRANSITION } from '@/constants/global';
import { useAuth } from '@/context/AuthContext';
interface HorizontalCardItemProps {
  item: Listing;
  router: Router;
}

export const HorizontalCardItem = ({
  item: { images, _id, city, neighborhood, createdAt, price, description, blurhash, user },
  router,
}: HorizontalCardItemProps) => {
  const { userId } = useAuth();
  const isOwner = user?._id === userId;
  const isExpired = listingHasExpired(createdAt);
  return (
    <View style={styles.listCard}>
      <Box style={styles.cardWrapper}>
        <Image
          style={styles.cardImage}
          source={{
            uri: `${process.env.EXPO_PUBLIC_API_URL}${images[0]}`,
          }}
          placeholder={{
            blurhash: blurhash || '',
          }}
          contentFit="cover"
          transition={BLURHASH_TRANSITION}
        />
        {images?.length > 1 && <Text style={styles.imageCounter}>+{images.length - 1} foto</Text>}
      </Box>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {city} / {neighborhood}
        </Text>
        {isExpired ? (
          <Text style={styles.expiredText}>❌ Skaduar</Text>
        ) : (
          <Text>
            {createdAt ? formatDate(createdAt) : ''} - {price}€ për muaj
          </Text>
        )}
        <Text numberOfLines={1} style={styles.cardDescription} ellipsizeMode="tail">
          {description}
        </Text>
        <Box flexDirection="row" gap={8} alignSelf="flex-start" marginTop={8}>
          {isOwner && (
            <Button
              disabled={isExpired}
              variant={!isExpired ? 'primary' : 'secondary'}
              onPress={() => router.push(`/edit/${_id}`)}
            >
              Ndrysho listimin
            </Button>
          )}
          <Button
            variant={!isExpired ? 'tertiary' : 'secondary'}
            disabled={isExpired}
            onPress={() => router.push(`/${_id}`)}
          >
            Shiko detajet
          </Button>
        </Box>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    flexShrink: 1,
    maxWidth: '100%',
    padding: 12,
  },
  expiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
  },
  cardImage: {
    backgroundColor: '#0553',
    width: 100,
    height: 140,
    borderRadius: 10,
  },
  cardWrapper: {
    width: 100,
    height: '100%',
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 8,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listCard: {
    marginBottom: 24,
    flexDirection: 'row',
    borderColor: Colors.lightGray,
  },
});
