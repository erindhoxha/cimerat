import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Linking, StyleSheet } from 'react-native';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function ItemDetailScreen() {
  const { item } = useLocalSearchParams();

  // TODO: Use item data here

  console.log(item);

  const { token } = useAuth();

  const isLoggedIn = !!token;

  const router = useRouter();

  return (
    <Box flex={1} style={styles.container}>
      <Image
        style={styles.cardImage}
        source={{
          uri: `${process.env.EXPO_PUBLIC_API_URL}/uploads/87d1ce538b289332d56de223aa4d2227`,
        }}
        contentFit="cover"
        placeholder={{
          blurhash,
        }}
        transition={1000}
      />
      <Box flex={1} paddingHorizontal={20} gap={12}>
        <Box flexDirection="column" justifyContent="space-between" gap={4} alignItems="flex-start">
          <Text fontSize="xl" fontWeight="bold" style={{ flexShrink: 1 }}>
            Prishtinë, Dardania
          </Text>
          <Text>300€ për muaj</Text>
        </Box>
        <Box style={styles.horizontalLine} />
        <Text>
          Jepet banesa me qira Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam id corporis culpa
          fuga sit nisi magni maiores necessitatibus? Blanditiis commodi, provident illum eos laboriosam corporis
          obcaecati repellendus eum labore hic!
        </Text>
        <Box style={styles.horizontalLine} />
        {isLoggedIn ? (
          <>
            <Box>
              <Text>
                Postuar nga <Text fontWeight="bold">Erind</Text>
              </Text>
            </Box>
            <Text>
              Tel:{' '}
              <Text
                style={styles.link}
                onPress={() => {
                  Linking.openURL('tel:+38348377390');
                }}
              >
                +383 (48) 377 390
              </Text>
            </Text>
            <Text>
              Email:{' '}
              <Text
                style={styles.link}
                onPress={() => {
                  Linking.openURL('mailto:erind.cbh@gmail.com');
                }}
              >
                erind.cbh@gmail.com
              </Text>
            </Text>
          </>
        ) : (
          <>
            <Text>Duhët të jeni te kyçur për të kontaktuar përsonin</Text>
            <Button
              variant="primary"
              onPress={() => {
                router.navigate('/login');
              }}
            >
              Kyçu për të kontaktuar
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  cardImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  horizontalLine: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.gray,
  },
  link: {
    color: Colors.blue,
    textDecorationLine: 'underline',
  },
});
