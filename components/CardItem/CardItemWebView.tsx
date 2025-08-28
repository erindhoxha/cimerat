import { useRouter } from 'expo-router';
import { View } from '../View/View';
import { Image } from 'expo-image';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { Box } from '../Box';
import { FontAwesome } from '@expo/vector-icons';
import { Pill } from '../Pill/Pill';
import Colors from '@/constants/Colors';
import { formatDate, listingHasExpired } from '@/utils';
import { Listing } from '@/types';
import { BLURHASH_TRANSITION } from '@/constants/global';
import { ReusableCarousel } from '@/components/Carousel/Carousel';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../Button';

export const CardItemWebView = ({
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
  const isWeb = Platform.OS === 'web';

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
        <Image
          style={styles.cardImage}
          source={{
            uri: `${process.env.EXPO_PUBLIC_API_URL}${images[0]}`,
          }}
          placeholder={{ blurhash: blurhash || '' }}
          contentFit="cover"
          transition={BLURHASH_TRANSITION}
        />

        <View style={styles.cardContent}>
          <View style={styles.topCardContent}>
            <Box flexDirection="row" justifyContent="space-between" flex={1} gap={12} style={{ flexWrap: 'wrap' }}>
              <Box flexDirection="column" justifyContent="flex-start" alignItems="flex-start" style={{ flexShrink: 1 }}>
                <Box flexDirection="row" gap={12}>
                  <Box
                    flexDirection="row"
                    alignItems="center"
                    paddingHorizontal={8}
                    paddingVertical={4}
                    borderRadius={12}
                    gap={12}
                    style={{
                      borderWidth: 1,
                      borderColor: 'rgba(0,0,0,0.1)',
                      marginBottom: 12,
                    }}
                  >
                    {rooms && rooms !== 'undefined' && (
                      <Box flexDirection="row" alignItems="center" gap={4}>
                        <Text>{rooms}</Text>
                        <FontAwesome name="bed" size={16} />
                      </Box>
                    )}
                    {currentFlatmates && currentFlatmates !== 'undefined' && (
                      <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
                        <Text>{currentFlatmates}</Text>
                        <FontAwesome name="user" size={16} />
                      </Box>
                    )}
                    {flatmateGender === 'Mashkull' ? (
                      <Box flexDirection="row" alignItems="center" gap={4}>
                        <Text>M</Text>
                        <FontAwesome name="male" size={16} />
                      </Box>
                    ) : flatmateGender === 'Femër' ? (
                      <Box flexDirection="row" alignItems="center" gap={4}>
                        <Text>F</Text>
                        <FontAwesome name="female" size={16} />
                      </Box>
                    ) : (
                      <Box flexDirection="row" alignItems="center" gap={4}>
                        <Text>M/F</Text>
                        <FontAwesome name="male" size={16} />
                        <FontAwesome name="female" size={16} />
                      </Box>
                    )}
                  </Box>

                  <Box>{isOwner && <Pill title="Listimi yt" />}</Box>
                </Box>

                <Text style={styles.cardTitle}>{city + ', ' + neighborhood}</Text>

                {isExpired ? (
                  <Text style={styles.expiredText}>❌ Skaduar</Text>
                ) : (
                  <Text style={styles.cardPrice}>{price}€ për muaj</Text>
                )}
              </Box>

              <Box flexDirection="column" justifyContent="flex-start" alignItems="flex-end" gap={12}>
                {createdAt && <Text>{formatDate(createdAt)}</Text>}
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

            <Text style={styles.cardSubtitle} ellipsizeMode="tail" numberOfLines={2}>
              {description}
            </Text>

            {user.verified && (
              <Box flexDirection="row" gap={8} marginTop={12}>
                <Pill
                  title="Personi i verifikuar"
                  variant="yellow"
                  iconLeft={<FontAwesome name="check" size={12} color="#000" />}
                />
              </Box>
            )}
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
    borderColor: 'rgba(0,0,0,0.1)',
    flexDirection: 'row', // horizontal
  },
  ownerCard: {
    borderColor: Colors.yellow,
    borderWidth: 2,
  },
  expiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 4,
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
  imageWrapper: {
    width: 180,
    height: 180,
    overflow: 'hidden',
  },
  cardImage: {
    width: 180,
    height: 'auto',
    backgroundColor: '#0553',
  },
  topCardContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardPrice: {
    fontSize: 14,
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 12,
  },
});
