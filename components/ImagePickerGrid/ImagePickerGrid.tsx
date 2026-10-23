import { useEffect, useState } from 'react';
import { ActivityIndicator, LayoutChangeEvent, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
  ZoomOut,
  FadeIn,
} from 'react-native-reanimated';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';

interface ImageData {
  type?: string;
  uri: string;
  name: string;
}

interface ImagePickerGridProps {
  images: ImageData[];
  error?: string | null;
  onPick: () => void;
  onPreview: (uri: string) => void;
  onRemove: (idx: number) => void;
  /** Moves a photo; index 0 is the cover shown on cards */
  onReorder?: (from: number, to: number) => void;
  /** True while the system picker is open or still handing back the photos */
  picking?: boolean;
  max?: number;
}

const COLUMNS = 3;
const GAP = 10;

// Soft pulse shown until the thumbnail has decoded
const Pulse = () => {
  const opacity = useSharedValue(0.5);
  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[StyleSheet.absoluteFill, styles.pulse, style]} />;
};

const Tile = ({
  uri,
  index,
  size,
  selected,
  onPress,
  onRemove,
}: {
  uri: string;
  index: number;
  size: number;
  selected: boolean;
  onPress: () => void;
  onRemove: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Animated.View
      entering={ZoomIn.springify().damping(14).mass(0.6)}
      exiting={ZoomOut.duration(160)}
      layout={LinearTransition.springify().damping(16)}
      style={[styles.tile, { width: size, height: size }, selected && styles.tileSelected]}
    >
      <Pressable
        onPress={onPress}
        style={StyleSheet.absoluteFill}
        accessibilityLabel={`Foto ${index + 1}`}
        accessibilityState={{ selected }}
      >
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && <Pulse />}
      </Pressable>
      {index === 0 && (
        <Box style={styles.coverBadge} pointerEvents="none">
          <Text style={styles.coverText}>Kryesore</Text>
        </Box>
      )}
      <Pressable onPress={onRemove} style={styles.remove} hitSlop={8} accessibilityLabel={`Largo foton ${index + 1}`}>
        <Ionicons name="close" size={14} color={Colors.white} />
      </Pressable>
    </Animated.View>
  );
};

export const ImagePickerGrid: React.FC<ImagePickerGridProps> = ({
  images,
  onPick,
  onPreview,
  onRemove,
  error,
  picking,
  onReorder,
  max = 10,
}) => {
  const [width, setWidth] = useState(0);
  // Tapping a photo selects it and shows the reorder toolbar (no drag & drop library needed)
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const selectedIndex = images.findIndex((img) => img.uri === selectedUri);
  const move = (to: number) => {
    if (selectedIndex < 0 || to < 0 || to >= images.length) return;
    onReorder?.(selectedIndex, to);
  };
  const size = width ? Math.floor((width - GAP * (COLUMNS - 1)) / COLUMNS) : 0;
  const full = images.length >= max;

  return (
    <Box gap={8}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="baseline">
        <Text style={styles.label}>
          Fotografitë<Text style={styles.asterisk}> *</Text>
        </Text>
        <Text style={styles.hint}>
          {images.length}/{max}
          {onReorder && images.length > 1 ? ' · prek një foto për ta lëvizur' : ' · e para shfaqet si kryesore'}
        </Text>
      </Box>

      <Box style={styles.grid} onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
        {size > 0 && (
          <>
            {!full && (
              <Animated.View layout={LinearTransition.springify().damping(16)}>
                <Pressable
                  onPress={onPick}
                  disabled={picking}
                  accessibilityRole="button"
                  accessibilityLabel="Shto foto"
                  style={({ pressed }) => [
                    styles.addTile,
                    { width: size, height: size },
                    !!error && styles.addTileError,
                    pressed && styles.addTilePressed,
                  ]}
                >
                  {picking ? (
                    <ActivityIndicator color={Colors.text} accessibilityLabel="Duke përgatitur fotot" />
                  ) : (
                    <>
                      <Box style={styles.addIcon}>
                        <Ionicons name="images-outline" size={20} color={Colors.text} />
                      </Box>
                      <Text style={[styles.addText, !!error && { color: Colors.danger }]}>Shto foto</Text>
                    </>
                  )}
                </Pressable>
              </Animated.View>
            )}
            {images.map(({ uri }, idx) => (
              <Tile
                key={uri}
                uri={uri}
                index={idx}
                size={size}
                selected={uri === selectedUri}
                onPress={() => (onReorder ? setSelectedUri((prev) => (prev === uri ? null : uri)) : onPreview(uri))}
                onRemove={() => {
                  if (uri === selectedUri) setSelectedUri(null);
                  onRemove(idx);
                }}
              />
            ))}
          </>
        )}
      </Box>
      {selectedIndex >= 0 && onReorder && (
        <Animated.View entering={FadeIn.duration(120)} style={styles.toolbar}>
          <ToolbarButton
            icon="chevron-back"
            label="Majtas"
            disabled={selectedIndex === 0}
            onPress={() => move(selectedIndex - 1)}
          />
          <ToolbarButton
            icon={selectedIndex === 0 ? 'star' : 'star-outline'}
            label={selectedIndex === 0 ? 'Kryesore' : 'Bëje kryesore'}
            disabled={selectedIndex === 0}
            onPress={() => move(0)}
          />
          <ToolbarButton
            icon="chevron-forward"
            label="Djathtas"
            disabled={selectedIndex === images.length - 1}
            onPress={() => move(selectedIndex + 1)}
          />
          <ToolbarButton icon="expand-outline" label="Shiko" onPress={() => onPreview(images[selectedIndex].uri)} />
        </Animated.View>
      )}
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </Box>
  );
};

const ToolbarButton = ({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [
      styles.toolbarButton,
      pressed && styles.toolbarPressed,
      disabled && styles.toolbarDisabled,
    ]}
  >
    <Ionicons name={icon} size={18} color={Colors.text} />
    <Text style={styles.toolbarText} numberOfLines={1}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textFade,
  },
  asterisk: {
    color: Colors.danger,
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  addTile: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderStrong,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addTileError: {
    borderColor: Colors.danger,
  },
  addTilePressed: {
    backgroundColor: Colors.lightGray,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  tile: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.imagePlaceholder,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  tileSelected: {
    borderColor: Colors.accent,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
    borderRadius: 14,
    backgroundColor: Colors.lightGray,
  },
  toolbarButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  toolbarPressed: {
    backgroundColor: Colors.surface,
  },
  toolbarDisabled: {
    opacity: 0.35,
  },
  toolbarText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  pulse: {
    backgroundColor: Colors.border,
  },
  coverBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  coverText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  remove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    color: Colors.danger,
    fontSize: 12,
  },
});
