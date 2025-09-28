import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { FontAwesome } from '@expo/vector-icons';

import { View } from '../View/View';
import { Box } from '../Box';
import { Text } from '../Text';
import { Button } from '../Button';
import { MobileCarousel } from '@/components/MobileCarousel/MobileCarousel';
import { WebCarousel } from '../WebCarousel/WebCarousel';

import { useAuth } from '@/context/AuthContext';
import { formatDate, listingHasExpired } from '@/utils';
import { ImageType, Listing } from '@/types';
import Colors from '@/constants/Colors';
import { BLURHASH_TRANSITION } from '@/constants/global';

export const MobileCardItem = ({
  city,
  neighborhood,
  images,
  description,
  user,
  price,
  _id,
  createdAt,
  currentFlatmates,
  rooms,
  blurhash,
  blurhashes,
}: Listing) => {
  const router = useRouter();
  const { userId } = useAuth();
  const [carouselIndex, setCarouselIndex] = useState(0);

  const isOwner = user?._id === userId;
  const isExpired = listingHasExpired(createdAt);
  const isWeb = Platform.OS === 'web';

  const CarouselComponent = isWeb ? WebCarousel : MobileCarousel;

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const maxThumbs = 5;
  let start = 0;
  if (carouselIndex > 1 && images.length > maxThumbs) {
    start = Math.min(carouselIndex - 1, images.length - maxThumbs);
  }
  const thumbnailsToShow = images.slice(start, start + maxThumbs);
  const thumbnailIndexes = thumbnailsToShow.map((img: ImageType) => images.indexOf(img));

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
          controlledIndex={carouselIndex}
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
        {images.length > 1 && (
          <Box style={styles.thumbnailRow}>
            {thumbnailsToShow.map((img: ImageType, idx: number) => {
              return (
                <Pressable
                  key={img as unknown as string}
                  onPress={(e) => {
                    e.stopPropagation();
                    setCarouselIndex(thumbnailIndexes[idx]);
                    setLightboxIndex(thumbnailIndexes[idx]);
                  }}
                  style={styles.thumbnailWrapper}
                >
                  <Image
                    source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${img}` }}
                    style={[
                      styles.thumbnailImage,
                      carouselIndex === thumbnailIndexes[idx] ? styles.thumbnailActive : {},
                    ]}
                    placeholder={{
                      blurhash: blurhashes ? blurhashes[thumbnailIndexes[idx]] : blurhash || '',
                    }}
                    contentFit="cover"
                  />
                </Pressable>
              );
            })}
          </Box>
        )}
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
                gap={8}
              >
                <Box flexDirection="column" justifyContent="flex-start" alignItems="flex-start" width="100%">
                  <Box marginBottom={8}>
                    {((rooms && rooms !== undefined) || (currentFlatmates && currentFlatmates !== undefined)) && (
                      <Box style={styles.featuresBox}>
                        {rooms && rooms !== 'undefined' && (
                          <Box style={styles.featureItem}>
                            <Text style={styles.text}>{rooms}</Text>
                            <FontAwesome name="bed" size={12} />
                          </Box>
                        )}
                        {currentFlatmates && currentFlatmates !== 'undefined' && (
                          <Box style={styles.featureItem}>
                            <Text style={styles.text}>{currentFlatmates}</Text>
                            <FontAwesome name="user" size={12} />
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>
                  <Box flexDirection="row" alignItems="flex-end" justifyContent="space-between" width="100%">
                    {createdAt && <Text>{formatDate(createdAt)}</Text>}
                    <Text style={styles.cardPrice}>{price}€ për muaj</Text>
                  </Box>
                </Box>
                {isWeb ? (
                  <Box>
                    <Text style={styles.cardTitle}>
                      {city}, {neighborhood}
                    </Text>
                    <Text style={styles.cardPrice}>{price}€ për muaj</Text>
                  </Box>
                ) : (
                  <Box>
                    <Text style={styles.cardTitle}>
                      {city}, {neighborhood}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
            <Text style={styles.cardSubtitle} ellipsizeMode="tail" numberOfLines={2}>
              {description}
            </Text>
            {isExpired && <Text style={styles.expiredText}>Listimi është skaduar</Text>}
            {isOwner && (
              <Box flexDirection="row" gap={8} marginTop={12}>
                <Button
                  disabled={isExpired}
                  variant={isExpired ? 'secondary' : 'primary'}
                  onPress={() => {
                    if (!isExpired) router.push(`/edit/${_id}`);
                  }}
                >
                  Modifiko listimin
                </Button>
              </Box>
            )}
          </View>
        </View>
      </View>
      <Modal visible={lightboxIndex !== null} transparent>
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
            {images.length > 1 && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : (lightboxIndex ?? 0) - 1);
                }}
                style={styles.lightboxArrowLeft}
              >
                <Text style={{ color: 'white', fontSize: 36, lineHeight: 36 }}>{'‹'}</Text>
              </TouchableOpacity>
            )}

            <Image
              style={styles.lightboxImage}
              contentFit="contain"
              source={{ uri: `${process.env.EXPO_PUBLIC_API_URL}${images[lightboxIndex ?? 0]}` }}
            />

            {/* Right arrow */}
            {images.length > 1 && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : (lightboxIndex ?? 0) + 1);
                }}
                style={styles.lightboxArrowRight}
              >
                <Text style={{ color: 'white', fontSize: 36, lineHeight: 36 }}>{'›'}</Text>
              </TouchableOpacity>
            )}

            {/* Image counter */}
            <Text style={styles.imageCounter}>
              {(lightboxIndex ?? 0) + 1} / {images.length}
            </Text>
          </Box>
          <Text style={styles.lightboxHint}>(prek kudo për të mbyllur)</Text>
        </Pressable>
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    color: Colors.textFade,
  },
  lightboxHint: {
    color: 'white',
    marginTop: 12,
    fontSize: 14,
  },
  imageCounter: {
    position: 'absolute',
    bottom: 40,
    color: 'white',
    fontSize: 16,
  },
  card: {
    marginVertical: 0,
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
    color: Colors.textFade,
  },
  cardPrice: {
    fontSize: 14,
    marginTop: 4,
  },
  expiredText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'red',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 16,
    display: 'none',
  },
  featuresBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    borderRadius: 24,
    gap: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
  thumbnailRow: {
    flexDirection: 'row',
    justifyContent: 'center', // changed from 'center'
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 0,
    width: '100%',
    paddingHorizontal: 12,
  },
  thumbnailWrapper: {
    flex: 1, // take equal space
    borderRadius: 8,
    maxHeight: 85,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    aspectRatio: 1.5, // or 1.2, adjust as you like
    minWidth: 0, // allow shrinking
    maxWidth: '100%', // optional, to avoid too large thumbs
  },
  thumbnailActive: {
    borderColor: Colors.yellow,
    borderWidth: 2,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.lightGray,
  },
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
});
