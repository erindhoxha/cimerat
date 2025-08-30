import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import { Ionicons } from '@expo/vector-icons';

interface NewCarouselProps<T> {
  data: T[];
  renderItem: (props: { item: T; index: number }) => React.ReactElement;
  height?: number;
  width?: number;
  style?: any;
  defaultIndex?: number;
  onProgressChange?: (index: number) => void;
}

export function NewCarousel<T>({
  data,
  renderItem,
  height,
  width,
  style,
  defaultIndex = 0,
  onProgressChange,
}: NewCarouselProps<T>) {
  const [index, setIndex] = React.useState(defaultIndex);

  React.useEffect(() => {
    onProgressChange?.(index);
  }, [index]);

  const carouselWidth = width ?? Dimensions.get('window').width;
  const carouselHeight = height ?? carouselWidth / 2;

  const goPrev = () => setIndex((i) => (i === 0 ? data.length - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === data.length - 1 ? 0 : i + 1));

  if (!data.length) return null;

  return (
    <Box style={[{ width: '100%', height: carouselHeight }, style]}>
      {/* Carousel Item */}
      <View style={styles.itemContainer}>{renderItem({ item: data[index], index })}</View>

      {/* Left Arrow */}
      {data.length > 1 && (
        <TouchableOpacity style={[styles.arrow, styles.left]} onPress={goPrev} accessibilityLabel="Previous">
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Right Arrow */}
      {data.length > 1 && (
        <TouchableOpacity style={[styles.arrow, styles.right]} onPress={goNext} accessibilityLabel="Next">
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Pagination Dots */}
      {data.length > 1 && (
        <Box style={styles.dotsContainer}>
          {data.map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dot, i === index && styles.activeDot]}
              onPress={() => setIndex(i)}
              accessibilityLabel={`Go to slide ${i + 1}`}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    width: '100%',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 24,
    padding: 8,
  },
  left: {
    left: 8,
  },
  right: {
    right: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
});
