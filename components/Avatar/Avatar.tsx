import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Image } from 'expo-image';
import { Text } from '../Text';
import { imageUrl } from '../ListingImage/ListingImage';
import Colors from '@/constants/Colors';
import { PublicUser } from '@/types';
import { displayName } from '@/utils';

interface AvatarProps {
  user?: Pick<PublicUser, '_id' | 'username' | 'fullName' | 'avatar'> | null;
  size?: number;
  /** Opens the user's public profile when pressed (default true) */
  linked?: boolean;
}

export const Avatar = ({ user, size = 40, linked = true }: AvatarProps) => {
  const router = useSafeRouter();
  const circle = { width: size, height: size, borderRadius: size / 2 };

  const content = user?.avatar ? (
    <Image
      source={{ uri: imageUrl(user.avatar) }}
      style={[styles.image, circle]}
      contentFit="cover"
      cachePolicy="memory-disk"
      transition={150}
    />
  ) : (
    <View style={[styles.fallback, circle]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{displayName(user)[0]?.toUpperCase() ?? '?'}</Text>
    </View>
  );

  if (!linked || !user?._id) return content;

  return (
    <Pressable
      hitSlop={6}
      accessibilityRole="link"
      accessibilityLabel={`Profili i ${displayName(user)}`}
      onPress={() => router.push(`/user/${user._id}`)}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.imagePlaceholder,
  },
  fallback: {
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontWeight: '700',
    color: Colors.accentInk,
  },
});
