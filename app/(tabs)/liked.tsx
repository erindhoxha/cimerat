import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
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
        throw new Error('Failed to fetch listings');
      }
      return res.json();
    },
  });

  const { data, error, isLoading, isRefetching } = listings;

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <ScrollView
      style={[styles.container]}
      refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={() => listings.refetch()} />}
    >
      <Box padding={20}>
        <WebView>
          {!isLoggedIn && listings.isFetched ? (
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
          {(isLoading || isRefetching) && (
            <Box marginTop={24}>
              <Loading />
            </Box>
          )}
          {isLoggedIn && !isLoading && (
            <Box marginTop={24}>
              {!!data?.length ? (
                data.map((item) => <HorizontalCardItem item={item} router={router} key={item._id} />)
              ) : (
                <Text style={styles.emptyText}>Nuk keni asnjë listim të ruajtur.</Text>
              )}
            </Box>
          )}
        </WebView>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    textAlign: 'center',
  },
  emptyText: {
    marginBottom: 24,
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
});
