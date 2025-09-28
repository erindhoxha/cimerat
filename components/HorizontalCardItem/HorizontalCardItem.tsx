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
import { FontAwesome } from '@expo/vector-icons';
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
  return (
    <View style={styles.listCard}>
      <Box style={styles.cardWrapper}>
        <Box flex={1}>
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
          {liked && (
            <Text style={styles.liked}>
              <FontAwesome name={liked ? 'heart' : 'heart-o'} size={14} color={Colors.yellow} />
            </Text>
          )}
          {images?.length > 1 && <Text style={styles.imageCounter}>+{images.length - 1} foto</Text>}
        </Box>
      </Box>
      <View style={styles.cardContent}>
        <Box flexDirection="row" gap={4} alignItems="center" marginBottom={4}>
          <Text style={styles.cardTitle}>
            {city}, {neighborhood}
          </Text>
        </Box>
        {isExpired ? (
          <Text style={styles.expiredText}>Listimi është skaduar</Text>
        ) : (
          <Text>
            {createdAt ? formatDate(createdAt) : ''}, {price}€ për muaj
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
              Modifiko listimin
            </Button>
          )}
          <Button variant="tertiary" onPress={() => router.push(`/${_id}`)}>
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
    height: '100%',
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
  liked: {
    position: 'absolute',
    top: 6,
    right: 6,
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
  },
  listCard: {
    flexDirection: 'row',
    borderColor: Colors.lightGray,
  },
});
