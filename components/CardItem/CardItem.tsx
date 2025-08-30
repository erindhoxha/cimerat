import { useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';

import { View } from '../View/View';
import { Box } from '../Box';
import { Text } from '../Text';
import { Pill } from '../Pill/Pill';
import { Button } from '../Button';
import { ReusableCarousel } from '@/components/Carousel/Carousel';
import { NewCarousel } from '../NewCarousel/NewCarousel';

import { useAuth } from '@/context/AuthContext';
import { formatDate, listingHasExpired } from '@/utils';
import { Listing } from '@/types';
import Colors from '@/constants/Colors';
import { BLURHASH_TRANSITION } from '@/constants/global';

export const CardItem = ({
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

  const CarouselComponent = isWeb ? NewCarousel : ReusableCarousel;

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
      <View style={styles.card}>
        <CarouselComponent
          style={isWeb ? styles.webCarousel : undefined}
          data={images}
          onProgressChange={setCarouselIndex}
          renderItem={({ item }) => (
            <Box style={styles.cardImage}>
              <Image
                style={styles.cardImage}
                source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${item}` }}
                placeholder={{ blurhash: blurhash || '' }}
                contentFit="cover"
                transition={BLURHASH_TRANSITION}
              />
            </Box>
          )}
        />

        <View style={styles.cardContent}>
          <View style={styles.topCardContent}>
            <Box
              flexDirection="row"
              justifyContent="space-between"
              flex={1}
              gap={12}
              flexWrap="wrap"
              style={isWeb && styles.webTopBox}
            >
              <Box
                flexDirection="column"
                justifyContent="flex-start"
                alignItems="flex-start"
                style={isWeb && styles.webColumnBox}
              >
                <Box style={styles.featuresBox}>
                  {rooms && rooms !== 'undefined' && (
                    <Box style={styles.featureItem}>
                      <Text>{rooms}</Text>
                      <FontAwesome name="bed" size={16} />
                    </Box>
                  )}
                  {currentFlatmates && currentFlatmates !== 'undefined' && (
                    <Box style={styles.featureItem}>
                      <Text>{currentFlatmates}</Text>
                      <FontAwesome name="user" size={16} />
                    </Box>
                  )}
                  {flatmateGender === 'Mashkull' ? (
                    <Box style={styles.featureItem}>
                      <Text>M</Text>
                      <FontAwesome name="male" size={16} />
                    </Box>
                  ) : flatmateGender === 'Femër' ? (
                    <Box style={styles.featureItem}>
                      <Text>F</Text>
                      <FontAwesome name="female" size={16} />
                    </Box>
                  ) : (
                    <Box style={styles.featureItem}>
                      <Text>M/F</Text>
                      <FontAwesome name="male" size={16} />
                      <FontAwesome name="female" size={16} />
                    </Box>
                  )}
                </Box>

                {isWeb ? (
                  <Box style={styles.webHeaderRow}>
                    <Text style={styles.cardTitle}>
                      {city}, {neighborhood}
                    </Text>
                    <Box flexDirection="column" alignItems="flex-end">
                      {createdAt && <Text>{formatDate(createdAt)}</Text>}
                    </Box>
                  </Box>
                ) : (
                  <>
                    <Text style={styles.cardTitle}>
                      {city}, {neighborhood}
                    </Text>
                    {isExpired ? (
                      <Text style={styles.expiredText}>❌ Skaduar</Text>
                    ) : (
                      <Text style={styles.cardPrice}>{price}€ për muaj</Text>
                    )}
                  </>
                )}
              </Box>

              {!isWeb &&
                (isExpired ? (
                  <Text style={styles.expiredText}>❌ Skaduar</Text>
                ) : (
                  <Text style={styles.cardPrice}>{price}€ për muaj</Text>
                ))}
            </Box>

            <Text style={styles.cardSubtitle} ellipsizeMode="tail" numberOfLines={2}>
              {description}
            </Text>

            {isOwner && (
              <Box flexDirection="row" gap={8} marginTop={12}>
                <Button
                  disabled={isExpired}
                  variant={isExpired ? 'secondary' : 'primary'}
                  onPress={() => router.push(`/edit/${_id}`)}
                >
                  Modifiko listimin
                </Button>
              </Box>
            )}

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
    marginVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: Colors.lightGray,
  },
  cardLink: {
    width: '100%',
    flex: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardImage: {
    flex: 1,
    backgroundColor: '#0553',
    height: 200,
    width: '100%',
    position: 'relative',
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
  expiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 16,
  },
  featuresBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 24,
    gap: 12,
    borderColor: Colors.gray,
    marginBottom: 12,
    borderWidth: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  webCarousel: {
    alignSelf: 'flex-start',
    maxHeight: 300,
    touchAction: 'auto',
  },
  webTopBox: {
    flexWrap: 'wrap',
  },
  webColumnBox: {
    width: '100%',
  },
  webHeaderRow: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
