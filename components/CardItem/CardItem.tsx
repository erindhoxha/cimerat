import { useRouter } from 'expo-router';
import { View } from '../View/View';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';
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
import { differenceInDays } from 'date-fns';

export const CardItem = ({
  city,
  neighborhood,
  images,
  description,
  user,
  price,
  _id,
  createdAt,
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
      onPress={() => router.push({ pathname: `/(item)/[item]`, params: { imageIndex: carouselIndex, item: _id } })}
    >
      <View style={styles.card}>
        <ReusableCarousel
          data={images}
          onProgressChange={setCarouselIndex}
          renderItem={({ item }) => {
            return (
              <Image
                style={styles.cardImage}
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_URL}${item}`,
                }}
                placeholder={{ blurhash: blurhash || '' }}
                contentFit="cover"
                transition={BLURHASH_TRANSITION}
              />
            );
          }}
        />
        <View style={styles.cardContent}>
          <View style={styles.topCardContent}>
            <Box flexDirection="row" justifyContent="space-between" flex={1} gap={12} flexWrap="wrap">
              <Box flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Text style={styles.cardTitle}>{city + ', ' + neighborhood}</Text>
                {isExpired ? (
                  <Text style={styles.expiredText}>❌ Skaduar</Text>
                ) : (
                  <Text style={styles.cardPrice}>{price}€ për muaj</Text>
                )}
              </Box>
              <Box flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                {createdAt && <Text>{formatDate(createdAt)}</Text>}
              </Box>
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
                  Ndrysho listimin
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
    marginVertical: 16,
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderColor: Colors.lightGray,
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
  cardInnerContent: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
    height: 'auto',
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
    marginTop: 16,
  },
});
