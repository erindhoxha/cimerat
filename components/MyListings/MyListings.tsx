import { StyleSheet } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '../Box';
import { Text } from '../Text';
import { Button } from '../Button';
import { Loading } from '../Loading/Loading';
import { CimerCard } from '../CimerCard/CimerCard';
import { HorizontalCardItem } from '../HorizontalCardItem/HorizontalCardItem';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { CimerPost, Listing } from '@/types';

// Everything the logged in user has posted: rooms they offer and posts about themselves
export const MyListings = () => {
  const router = useSafeRouter();
  const { userId } = useAuth();
  // Same query as the public profile, so creating/deleting keeps both in sync
  const { data, isLoading } = useQuery<{ listings: Listing[]; posts: CimerPost[] }>({
    queryKey: ['public-user', userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${userId}`);
      if (!res.ok) return Promise.reject(new Error('Gjetja e listimeve dështoi.'));
      return res.json();
    },
  });

  if (isLoading || !data) return <Loading />;

  const { listings, posts } = data;

  return (
    <Box gap={24} marginBottom={40}>
      <Box flexDirection="row" gap={10}>
        <Button style={styles.flexOne} icon="home-outline" onPress={() => router.push('/create')}>
          Posto dhomë
        </Button>
        <Button
          style={styles.flexOne}
          variant="tertiary"
          icon="person-outline"
          onPress={() => router.push('/cimerat/create')}
        >
          Posto veten
        </Button>
      </Box>

      {listings.length === 0 && posts.length === 0 ? (
        <Box style={styles.empty}>
          <Box style={styles.emptyIcon}>
            <Ionicons name="albums-outline" size={26} color={Colors.textMuted} />
          </Box>
          <Text style={styles.emptyTitle}>Ende asnjë listim</Text>
          <Text style={styles.emptyText}>Postoni një dhomë të lirë ose postoni veten si cimer.</Text>
        </Box>
      ) : (
        <>
          {listings.length > 0 && (
            <Box gap={12}>
              <Text style={styles.sectionTitle}>
                Dhomat <Text style={styles.count}>{listings.length}</Text>
              </Text>
              {listings.map((listing) => (
                <HorizontalCardItem key={listing._id} item={listing} router={router} liked={false} />
              ))}
            </Box>
          )}
          {posts.length > 0 && (
            <Box gap={12}>
              <Text style={styles.sectionTitle}>
                Postimet si cimer <Text style={styles.count}>{posts.length}</Text>
              </Text>
              {posts.map((post) => (
                <CimerCard key={post._id} post={post} />
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  count: {
    fontWeight: '500',
    color: Colors.textMuted,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
