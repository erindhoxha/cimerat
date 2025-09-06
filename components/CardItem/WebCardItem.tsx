import { useRouter } from 'expo-router';
import { View } from '../View/View';
import { Image } from 'expo-image';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { Box } from '../Box';
import { FontAwesome } from '@expo/vector-icons';
import { Pill } from '../Pill/Pill';
import Colors from '@/constants/Colors';
import { formatDate, listingHasExpired } from '@/utils';
import { Listing } from '@/types';
import { BLURHASH_TRANSITION } from '@/constants/global';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../Button';

export const WebCardItem = ({
  city,
  neighborhood,
  images,
  description,
  user,
  price,
  _id,
  createdAt,
  currentFlatmates,
  flatmateGender,
  rooms,
  blurhash,
}: Listing) => {
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const { userId } = useAuth();

  const isOwner = user?._id === userId;
  const isExpired = listingHasExpired(createdAt);

  return (
    <Pressable
      style={styles.cardLink}
      onPress={() =>
        router.push({
          pathname: `/(item)/[item]`,
          params: { imageIndex: carouselIndex, item: _id },
        })
      }
    >
      <View style={[styles.card, isOwner && styles.ownerCard]}>
        <Box style={styles.cardBox}>
          <Image
            style={styles.cardImage}
            source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${images[0]}` }}
            placeholder={{ blurhash: blurhash || '' }}
            contentFit="cover"
            transition={BLURHASH_TRANSITION}
          />
          {images?.length > 1 && <Text style={styles.imageCounter}>+{images.length - 1} foto</Text>}
        </Box>

        <View style={styles.cardContent}>
          <View style={styles.topCardContent}>
            <Box style={styles.metaRow}>
              <Box style={styles.metaLeft}>
                <Box>
                  <Box flexDirection="row" gap={12} alignItems="center">
                    <Text style={styles.cardTitle}>{city + ', ' + neighborhood}</Text>
                    <Box style={styles.metaTags}>
                      <Box style={styles.cardInner}>
                        {rooms && rooms !== 'undefined' && (
                          <Box style={styles.metaItem}>
                            <Text style={styles.text}>{rooms}</Text>
                            <FontAwesome name="bed" size={12} color={Colors.textFade} />
                          </Box>
                        )}
                        {currentFlatmates && currentFlatmates !== 'undefined' && (
                          <Box style={styles.metaItem}>
                            <Text style={styles.text}>{currentFlatmates}</Text>
                            <FontAwesome name="user" size={12} color={Colors.textFade} />
                          </Box>
                        )}
                        {flatmateGender === 'Mashkull' ? (
                          <Box style={styles.metaItem}>
                            <Text style={styles.text}>M</Text>
                            <FontAwesome name="male" size={12} color={Colors.textFade} />
                          </Box>
                        ) : flatmateGender === 'Femër' ? (
                          <Box style={styles.metaItem}>
                            <Text style={styles.text}>F</Text>
                            <FontAwesome name="female" size={12} color={Colors.textFade} />
                          </Box>
                        ) : (
                          <Box style={styles.metaItem}>
                            <FontAwesome name="male" size={12} color={Colors.textFade} />
                            <FontAwesome name="female" size={12} color={Colors.textFade} />
                          </Box>
                        )}
                      </Box>
                      {isOwner && <Pill title="Listimi yt" />}
                    </Box>
                  </Box>
                  {isExpired ? (
                    <Text style={styles.expiredText}>❌ Skaduar</Text>
                  ) : (
                    <Text style={styles.cardPrice}>{price}€ për muaj</Text>
                  )}
                </Box>
              </Box>

              <Box style={styles.ownerActions}>
                {createdAt && <Text style={styles.text}>{formatDate(createdAt)}</Text>}
                {isOwner && (
                  <Button
                    disabled={isExpired}
                    variant={isExpired ? 'secondary' : 'tertiary'}
                    onPress={() => router.push(`/edit/${_id}`)}
                  >
                    Modifiko listimin
                  </Button>
                )}
              </Box>
            </Box>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: 'rgba(0,0,0,0.08)',
    flexDirection: 'row',
  },
  ownerCard: {
    borderColor: Colors.yellow,
    borderWidth: 2,
  },
  cardBox: {
    width: 180,
    height: 'auto',
    backgroundColor: '#0553',
  },
  text: {
    fontSize: 14,
    color: Colors.textFade,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageCounter: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: Colors.yellow,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    zIndex: 5,
  },
  cardLink: {
    width: '100%',
    flex: 1,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
    flex: 1,
  },
  topCardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textFade,
  },
  expiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 14,
    marginTop: 4,
    color: Colors.textFade,
  },
  cardSubtitle: {
    fontWeight: '400',
    marginTop: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    flexWrap: 'wrap',
    gap: 12,
  },
  metaLeft: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexShrink: 1,
    gap: 4,
  },
  metaTags: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    fontSize: 14,
  },
  ownerActions: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 12,
  },
});
