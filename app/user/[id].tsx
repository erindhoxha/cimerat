import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar/Avatar';
import { Loading } from '@/components/Loading/Loading';
import { WebView } from '@/components/WebView/WebView';
import { CimerCard } from '@/components/CimerCard/CimerCard';
import { ContactButtons } from '@/components/ContactButtons/ContactButtons';
import { HorizontalCardItem } from '@/components/HorizontalCardItem/HorizontalCardItem';
import { useAuth } from '@/context/AuthContext';
import { displayName, formatDate } from '@/utils';
import Colors from '@/constants/Colors';
import { CimerPost, Listing, PublicUser } from '@/types';

interface PublicProfile {
  user: PublicUser;
  listings: Listing[];
  posts: CimerPost[];
}

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useSafeRouter();
  const { userId } = useAuth();
  const isMe = id === userId;

  const { data, isLoading, isRefetching, error, refetch } = useQuery<PublicProfile>({
    queryKey: ['public-user', id],
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/users/${id}`);
      if (!res.ok) return Promise.reject(new Error('Profili nuk u gjet.'));
      return res.json();
    },
  });

  if (isLoading) return <Loading />;
  if (error || !data) {
    return (
      <WebView>
        <Text style={styles.muted}>{error?.message ?? 'Profili nuk u gjet.'}</Text>
      </WebView>
    );
  }

  const { user, listings, posts } = data;
  // Profile phones are private, so contact goes through a number they chose to publish on a post or listing
  const contactPhone = posts.find((p) => p.phone)?.phone ?? listings.find((l) => l.phone)?.phone;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
    >
      <WebView>
        <Box alignItems="center" gap={6} marginBottom={24}>
          <Avatar user={user} size={96} linked={false} />
          <Text style={styles.name}>{displayName(user)}</Text>
          {!!user.fullName && <Text style={styles.handle}>@{user.username}</Text>}
          {user.createdAt && <Text style={styles.muted}>Anëtar që nga {formatDate(user.createdAt)}</Text>}

          <Box style={styles.stats}>
            <Box style={styles.stat}>
              <Text style={styles.statValue}>{listings.length}</Text>
              <Text style={styles.statLabel}>Banesa</Text>
            </Box>
            <Box style={styles.statDivider} />
            <Box style={styles.stat}>
              <Text style={styles.statValue}>{posts.length}</Text>
              <Text style={styles.statLabel}>Postime si cimer</Text>
            </Box>
          </Box>

          {!isMe && contactPhone && (
            <Box alignSelf="stretch" marginTop={12}>
              <ContactButtons
                phone={contactPhone}
                message={`Përshëndetje ${displayName(user)}, ju shkruaj nga Cimerat.`}
              />
            </Box>
          )}

          {isMe && (
            <Button variant="tertiary" style={styles.editButton} onPress={() => router.push('/profile')}>
              Ndrysho profilin
            </Button>
          )}
        </Box>

        {posts.length > 0 && (
          <Box gap={12} marginBottom={28}>
            <Text style={styles.sectionTitle}>Kërkon dhomë</Text>
            {posts.map((post) => (
              <CimerCard key={post._id} post={post} hideContact={!!contactPhone} />
            ))}
          </Box>
        )}

        {listings.length > 0 && (
          <Box gap={12} marginBottom={28}>
            <Text style={styles.sectionTitle}>Banesat e postuara</Text>
            {listings.map((listing) => (
              <HorizontalCardItem key={listing._id} item={listing} router={router} liked={false} />
            ))}
          </Box>
        )}

        {posts.length === 0 && listings.length === 0 && (
          <Text style={[styles.muted, styles.center]}>
            {isMe ? 'Ende nuk keni postuar asgjë.' : `${displayName(user)} ende nuk ka postuar asgjë.`}
          </Text>
        )}
      </WebView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: Colors.text,
    marginTop: 8,
  },
  handle: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: -2,
  },
  muted: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  center: {
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  editButton: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
});
