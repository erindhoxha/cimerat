import { useState } from 'react';
import { ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image, ImageContentFit } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { BLURHASH_TRANSITION } from '@/constants/global';

interface ListingImageProps {
  path?: string;
  blurhash?: string | null;
  style?: StyleProp<ImageStyle>;
  contentFit?: ImageContentFit;
  priority?: 'low' | 'normal' | 'high';
}

export const imageUrl = (path?: string) => (path ? `${process.env.EXPO_PUBLIC_API_URL}${path}` : undefined);

export const ListingImage = ({ path, blurhash, style, contentFit = 'cover', priority }: ListingImageProps) => {
  const uri = imageUrl(path);
  // Tracked per uri so a recycled list cell doesn't keep a previous image's error
  const [failedUri, setFailedUri] = useState<string>();
  const [retried, setRetried] = useState<string>();
  const failed = failedUri === uri;

  // Without this the blurhash stays on screen forever when a file is missing on the server
  if (failed || !uri) {
    return (
      <View style={[styles.fallback, style as StyleProp<ViewStyle>]}>
        <Ionicons name="image-outline" size={28} color={Colors.gray} />
      </View>
    );
  }

  return (
    <Image
      style={[styles.image, style]}
      source={{ uri: retried === uri ? `${uri}?retry=1` : uri }}
      placeholder={blurhash ? { blurhash } : undefined}
      placeholderContentFit="cover"
      contentFit={contentFit}
      transition={BLURHASH_TRANSITION}
      cachePolicy="memory-disk"
      recyclingKey={uri}
      priority={priority}
      onError={() => {
        // Retry once (e.g. a just-uploaded file or a flaky connection) before showing the fallback
        if (retried !== uri) {
          setRetried(uri);
          return;
        }
        setFailedUri(uri);
      }}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.imagePlaceholder,
  },
  fallback: {
    backgroundColor: Colors.imagePlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
