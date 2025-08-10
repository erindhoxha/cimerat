import { Image } from 'expo-image';
import { ImageSourcePropType, StyleSheet, TouchableOpacity } from 'react-native';
import { View } from '../View/View';
import { Router } from 'expo-router';
import { Text } from '../Text';
import Colors from '@/constants/Colors';
import { Box } from '../Box';
import { Button } from '../Button';
import { Listing } from '@/types';
import { format } from 'date-fns';
import { sq } from 'date-fns/locale'; // Albanian locale

interface HorizontalCardItemProps {
  item: Listing;
  router: Router;
}

export const HorizontalCardItem = ({ item, router }: HorizontalCardItemProps) => {
  let formatted;

  if (item.createdAt) {
    const isoDate = item.createdAt ?? '';
    const date = new Date(isoDate);

    formatted = format(date, 'd MMMM, yyyy', { locale: sq });
  }

  return (
    <View style={styles.listCard}>
      <Image
        style={styles.cardImage}
        source={{
          uri: `${process.env.EXPO_PUBLIC_API_URL}${item.images[0]}`,
        }}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.city} / {item.neighborhood}
        </Text>
        <Text>
          {item.createdAt ? formatted : ''} / {item.price}€ për muaj
        </Text>
        <Text numberOfLines={1} style={styles.cardDescription} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Box flexDirection="row" gap={8} alignSelf="flex-start" marginTop={8}>
          <Button variant="tertiary" onPress={() => router.push(`/${item._id}`)}>
            Ndrysho listimin
          </Button>
          <Button variant="secondary" onPress={() => router.push(`/${item._id}`)}>
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
  cardImage: {
    backgroundColor: '#0553',
    width: 100,
    height: '100%',
    borderRadius: 10,
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 8,
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
