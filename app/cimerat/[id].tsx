import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import { Avatar } from '@/components/Avatar/Avatar';
import { Loading } from '@/components/Loading/Loading';
import { WebView } from '@/components/WebView/WebView';
import { ContactButtons } from '@/components/ContactButtons/ContactButtons';
import { OwnerActions } from '@/components/OwnerActions/OwnerActions';
import { Feature } from '@/components/CardItem/MobileCardItem';
import { useAuth } from '@/context/AuthContext';
import { useDeleteCimerPost } from '@/hooks/useDeleteCimerPost';
import { displayName, formatDate, formatKosovoPhone } from '@/utils';
import Colors from '@/constants/Colors';
import { CimerPost } from '@/types';
import { cityAfterNe } from '@/constants/Cities';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Stat = ({ icon, label, value }: { icon: IconName; label: string; value?: string }) => (
  <Box style={styles.stat}>
    <Ionicons name={icon} size={18} color={Colors.text} />
    <Text style={styles.statValue}>{value || '–'}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Box>
);

export default function CimerPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useSafeRouter();
  const { userId } = useAuth();
  const confirmDelete = useDeleteCimerPost();

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<CimerPost>({
    // Same key the edit form uses, so saving there refreshes this page
    queryKey: ['cimer-post', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/cimerat/${id}`);
      if (!res.ok) return Promise.reject(new Error('Postimi nuk u gjet.'));
      return res.json();
    },
  });

  if (isLoading) return <Loading />;
  if (error || !post) {
    return (
      <WebView>
        <Text style={styles.muted}>{error?.message ?? 'Postimi nuk u gjet.'}</Text>
      </WebView>
    );
  }

  const isOwner = post.user?._id === userId;
  const name = displayName(post.user);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WebView>
        <Box alignItems="center" gap={6}>
          <Avatar user={post.user} size={112} />
          <Text style={styles.name}>
            {name}
            {post.age ? <Text style={styles.age}>, {post.age}</Text> : null}
          </Text>
          <Box flexDirection="row" alignItems="center" gap={6}>
            <Ionicons name="location-outline" size={15} color={Colors.textMuted} />
            <Text style={styles.muted}>Kërkon dhomë në {cityAfterNe(post.city)}</Text>
          </Box>
        </Box>

        <Box style={styles.budgetCard}>
          <Text style={styles.budgetLabel}>Buxheti maksimal</Text>
          <Text style={styles.budget}>
            {post.budget}€<Text style={styles.budgetUnit}> /muaj</Text>
          </Text>
        </Box>

        <Box style={styles.stats}>
          <Stat icon="location-outline" label="Qyteti" value={post.city} />
          <Box style={styles.statDivider} />
          <Stat icon="calendar-outline" label="Mosha" value={post.age ? String(post.age) : undefined} />
          <Box style={styles.statDivider} />
          <Stat
            icon={post.gender === 'Femër' ? 'female' : post.gender === 'Mashkull' ? 'male' : 'person-outline'}
            label="Gjinia"
            value={post.gender}
          />
        </Box>

        <Box gap={8} marginTop={24}>
          <Text style={styles.sectionTitle}>Rreth meje</Text>
          <Text style={styles.description}>{post.description}</Text>
        </Box>

        {post.neighborhoods?.length > 0 && (
          <Box gap={8} marginTop={24}>
            <Text style={styles.sectionTitle}>Lagjet e preferuara</Text>
            <Box flexDirection="row" flexWrap="wrap" gap={8}>
              {post.neighborhoods.map((n) => (
                <Feature key={n} icon="location-outline" label={n} />
              ))}
            </Box>
          </Box>
        )}

        <Pressable
          style={({ pressed }) => [styles.author, pressed && styles.pressed]}
          onPress={() => router.push(`/user/${post.user._id}`)}
        >
          <Avatar user={post.user} size={44} linked={false} />
          <Box flex={1}>
            <Text style={styles.authorName}>{name}</Text>
            <Text style={styles.muted}>Postuar më {formatDate(post.createdAt)}</Text>
          </Box>
          <Text style={styles.link}>Shiko profilin</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
        </Pressable>

        {isOwner ? (
          <Box style={styles.ownerBox}>
            <OwnerActions
              style={{ borderTopWidth: 0 }}
              onEdit={() => router.push({ pathname: '/cimerat/create', params: { id: post._id } })}
              onDelete={() => confirmDelete(post._id, () => router.back())}
            />
          </Box>
        ) : (
          !!post.phone && (
            <Box gap={8} marginTop={24}>
              <Box flexDirection="row" justifyContent="space-between" alignItems="baseline">
                <Text style={styles.sectionTitle}>Kontakto</Text>
                <Text style={styles.muted} selectable>
                  {formatKosovoPhone(post.phone)}
                </Text>
              </Box>
              <ContactButtons phone={post.phone} message={`Përshëndetje ${name}, pashë postimin tuaj në Cimerat.`} />
            </Box>
          )
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
  content: {
    paddingBottom: 48,
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.text,
    marginTop: 10,
    textAlign: 'center',
  },
  age: {
    fontWeight: '500',
    color: Colors.textMuted,
  },
  muted: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  budgetCard: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: Colors.accentSoft,
  },
  budgetLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accentInk,
  },
  budget: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: Colors.text,
    marginTop: 2,
  },
  budgetUnit: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textFade,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.cardBorder,
  },
  pressed: {
    opacity: 0.7,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.accentInk,
  },
  ownerBox: {
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
});
