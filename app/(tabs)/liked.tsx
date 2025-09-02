import { Dimensions, Platform, RefreshControl, ScrollView, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { HorizontalCardItem } from '@/components/HorizontalCardItem/HorizontalCardItem';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button/Button';
import { Box } from '@/components/Box';
import { useAuth } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/types';
import { Loading } from '@/components/Loading/Loading';
import { WebView } from '@/components/WebView/WebView';
import { CardItemWebView } from '@/components/CardItem/CardItemWebView';

export default function Liked() {
  const { token } = useAuth();
  const router = useRouter();
  const isLoggedIn = !!token;

  const listings = useQuery<Listing[]>({
    queryKey: ['liked-listings'],
    enabled: isLoggedIn,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/liked-listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) {
        return Promise.reject('Gjetja e listimeve ishte e pasuksesshme nga ana jonë.');
      }
      return res.json();
    },
  });

  const { data, error, isLoading, isRefetching } = listings;

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const isWeb = Platform.OS === 'web';
  const { width } = Dimensions.get('window');
  const isDesktop = width > 768;

  return (
    <ScrollView
      style={[styles.container, !isWeb && { backgroundColor: 'white' }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isRefetching && isLoading} onRefresh={() => listings.refetch()} />}
    >
      <WebView>
        {!isLoggedIn ? (
          <Box marginTop={24} gap={12} style={styles.centeredBox}>
            <Box>
              <FontAwesome name="exclamation" size={48} color={Colors.danger} />
            </Box>
            <Text fontSize="xl" fontWeight="bold">
              Nuk jeni të kyçur
            </Text>
            <Text style={styles.text}>Ju lutemi, kyçuni për të krijuar listime ose për të parë listimet tuaja.</Text>
            <Link href="/login" asChild>
              <Button style={styles.fullWidthButton}>
                <Text>Kyçu</Text>
              </Button>
            </Link>
          </Box>
        ) : (
          <Box gap={12}>
            <Text fontSize="xl" fontWeight="bold">
              Listimet e preferuara
            </Text>
          </Box>
        )}
        {isLoading && (
          <Box marginTop={24}>
            <Loading />
          </Box>
        )}
        {isLoggedIn && !isLoading && (
          <Box marginTop={24} gap={12}>
            {!!data?.length ? (
              data.map((item) =>
                isWeb && isDesktop ? (
                  <CardItemWebView {...item} key={item._id} />
                ) : (
                  <HorizontalCardItem item={item} router={router} key={item._id} liked={true} />
                ),
              )
            ) : (
              <Box flexDirection="column">
                <Text style={styles.emptyText}>Nuk keni asnjë listim të ruajtur.</Text>
                <Button variant="tertiary" onPress={() => router.push('/')}>
                  Shikoni listimet e tjera
                </Button>
              </Box>
            )}
          </Box>
        )}
      </WebView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  text: {
    textAlign: 'center',
  },
  emptyText: {
    marginBottom: 12,
  },
  separator: {
    marginBottom: 12,
    marginTop: 24,
    height: 1,
    width: '100%',
    backgroundColor: Colors.gray,
  },
  centeredBox: {
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
});
