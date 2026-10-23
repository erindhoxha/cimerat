import { RefreshControl, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import Colors from '@/constants/Colors';
import { Link } from 'expo-router';
import { HorizontalCardItem } from '@/components/HorizontalCardItem/HorizontalCardItem';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button/Button';
import { Box } from '@/components/Box';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Listing } from '@/types';
import { Loading } from '@/components/Loading/Loading';
import { WebView } from '@/components/WebView/WebView';
import { useEffect, useState } from 'react';

export default function TabTwoScreen() {
  const { token } = useAuth();
  const router = useSafeRouter();
  const isLoggedIn = !!token;

  const listings = useQuery<Listing[]>({
    queryKey: ['my-listings'],
    enabled: isLoggedIn,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/my-listings`, {
        headers: {
          Authorization: `Bearer ${token}`,
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
    return <Text style={{ padding: 20 }}>{typeof error === 'string' ? error : error.message}</Text>;
  }

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    setAuthChecked(true);
  }, [token]);

  if (!authChecked) {
    return <Loading />;
  }

  if (isLoading || isRefetching) {
    return <Loading />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: 'white' }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isLoading || isRefetching} onRefresh={() => listings.refetch()} />}
    >
      <WebView>
        {isLoggedIn && (
          <Box gap={12}>
            <Text fontSize="xl" fontWeight="bold">
              Listimet e mia
            </Text>
            <Link href="/create" asChild>
              <Button>
                <Text>Krijo një listim të ri</Text>
              </Button>
            </Link>
          </Box>
        )}
        {(isLoading || isRefetching) && (
          <Box marginTop={24}>
            <Loading />
          </Box>
        )}
        {!isLoggedIn && (
          <Box marginTop={24} gap={12} style={styles.centeredBox}>
            <Box style={styles.emptyIcon}>
              <Ionicons name="albums-outline" size={26} color={Colors.textMuted} />
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
        )}

        {isLoggedIn && !isLoading && (
          <Box marginTop={24} gap={12}>
            {!!data?.length ? (
              data.map((item) => <HorizontalCardItem liked={false} item={item} router={router} key={item._id} />)
            ) : (
              <Text style={styles.emptyText}>
                Nuk keni asnjë listim të krijuar. Shtoni një listim të ri duke klikuar në butonin "Krijo" në skedën e
                sipërme.
              </Text>
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
  },
  contentContainer: {
    minHeight: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  text: {
    textAlign: 'center',
    color: Colors.textMuted,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    flex: 1,
  },
  fullWidthButton: {
    width: '100%',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
