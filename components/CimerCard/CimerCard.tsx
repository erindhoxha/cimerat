import { Pressable, StyleSheet } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Box } from '../Box';
import { Text } from '../Text';
import { OwnerActions } from '../OwnerActions/OwnerActions';
import { useDeleteCimerPost } from '@/hooks/useDeleteCimerPost';
import { Avatar } from '../Avatar/Avatar';
import { ContactButtons } from '../ContactButtons/ContactButtons';
import { Feature } from '../CardItem/MobileCardItem';
import Colors from '@/constants/Colors';
import { CimerPost } from '@/types';
import { cityAfterNe } from '@/constants/Cities';
import { displayName, formatDate } from '@/utils';
import { useAuth } from '@/context/AuthContext';

interface CimerCardProps {
  post: CimerPost;
  /** Hide the call/WhatsApp/Viber row, e.g. on a profile that already shows one at the top */
  hideContact?: boolean;
}

export const CimerCard = ({ post, hideContact }: CimerCardProps) => {
  const router = useSafeRouter();
  const { userId } = useAuth();
  const isOwner = post.user?._id === userId;
  const confirmDelete = useDeleteCimerPost();

  return (
    <Box style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.body, pressed && styles.pressed]}
        onPress={() => router.push(`/cimerat/${post._id}`)}
        accessibilityRole="button"
        accessibilityLabel={`Postimi i ${displayName(post.user)}`}
      >
        <Box flexDirection="row" alignItems="center" gap={12}>
          <Avatar user={post.user} size={52} />
          <Box flex={1}>
            <Pressable onPress={() => router.push(`/user/${post.user._id}`)} hitSlop={4}>
              <Text style={styles.name} numberOfLines={1}>
                {displayName(post.user)}
                {post.age ? <Text style={styles.age}>, {post.age}</Text> : null}
              </Text>
            </Pressable>
            <Text style={styles.meta} numberOfLines={1}>
              Kërkon dhomë në {cityAfterNe(post.city)} · {formatDate(post.createdAt)}
            </Text>
          </Box>
          <Box alignItems="flex-end">
            <Text style={styles.budget}>{post.budget}€</Text>
            <Text style={styles.budgetLabel}>buxheti/muaj</Text>
          </Box>
        </Box>

        <Text style={styles.description} numberOfLines={5}>
          {post.description}
        </Text>

        {(!!post.gender || post.neighborhoods?.length > 0) && (
          <Box flexDirection="row" gap={8} flexWrap="wrap">
            {!!post.gender && <Feature icon={post.gender === 'Femër' ? 'female' : 'male'} label={post.gender} />}
            {post.neighborhoods?.map((n) => (
              <Feature key={n} icon="location-outline" label={n} />
            ))}
          </Box>
        )}

        {!!post.phone && !isOwner && !hideContact && (
          <ContactButtons
            phone={post.phone}
            message={`Përshëndetje ${displayName(post.user)}, pashë postimin tuaj në Cimerat.`}
          />
        )}
      </Pressable>
      {isOwner && (
        <OwnerActions
          onEdit={() => router.push({ pathname: '/cimerat/create', params: { id: post._id } })}
          onDelete={() => confirmDelete(post._id)}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  body: {
    gap: 14,
    padding: 16,
  },
  pressed: {
    backgroundColor: Colors.background,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  age: {
    fontWeight: '500',
    color: Colors.textMuted,
  },
  meta: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  budget: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  budgetLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    color: Colors.textFade,
  },
});
