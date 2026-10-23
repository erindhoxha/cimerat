import { useEffect, useRef, useState } from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import { useSharedValue, configureReanimatedLogger } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

// disable warnings
configureReanimatedLogger({
  strict: false,
});

interface ReusableCarouselProps<T> {
  data: T[];
  renderItem: (props: { item: T; index: number }) => React.ReactElement;
  /** width / height of each slide */
  aspectRatio?: number;
  style?: StyleProp<ViewStyle>;
  defaultIndex?: number;
  onProgressChange?: (index: number) => void;
  controlledIndex?: number;
}

export function MobileCarousel<T>({
  data,
  renderItem,
  aspectRatio = 4 / 3,
  style,
  defaultIndex,
  onProgressChange,
  controlledIndex,
}: ReusableCarouselProps<T>) {
  const ref = useRef<ICarouselInstance>(null);
  const progresSharedValue = useSharedValue<number>(defaultIndex ?? 0);
  const [currentIndex, setCurrentIndex] = useState(defaultIndex ?? 0);
  // Measured instead of using the window width, so slides line up inside padded cards
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (typeof controlledIndex === 'number' && controlledIndex !== currentIndex) {
      setCurrentIndex(controlledIndex);
      ref.current?.scrollTo({
        count: controlledIndex - progresSharedValue.value,
        animated: true,
      });
    }
  }, [controlledIndex]);

  const onLayout = (e: LayoutChangeEvent) => {
    const next = Math.round(e.nativeEvent.layout.width);
    if (next !== width) setWidth(next);
  };

  const height = width / aspectRatio;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progresSharedValue.value,
      animated: true,
    });
  };

  const isCarousel = data.length > 1;

  const goTo = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    ref.current?.scrollTo({
      count: nextIndex - progresSharedValue.value,
      animated: true,
    });
  };

  const goLeft = () => isCarousel && goTo(currentIndex === 0 ? data.length - 1 : currentIndex - 1);
  const goRight = () => isCarousel && goTo(currentIndex === data.length - 1 ? 0 : currentIndex + 1);

  return (
    <View style={[styles.container, { aspectRatio }, style]} onLayout={onLayout}>
      {width > 0 && (
        <Carousel
          ref={ref}
          width={width}
          height={height}
          defaultIndex={defaultIndex}
          data={data}
          loop={isCarousel}
          onProgressChange={(_, absoluteProgress) => {
            progresSharedValue.value = absoluteProgress;
            const rounded = Math.round(absoluteProgress) % data.length;
            setCurrentIndex(rounded);
            onProgressChange?.(rounded);
          }}
          onConfigurePanGesture={(panGesture) => {
            panGesture.activeOffsetX([-10, 10]);
          }}
          enabled={isCarousel}
          renderItem={({ item, index }) => renderItem({ item, index })}
        />
      )}
      {isCarousel && (
        <>
          <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={goLeft} hitSlop={10}>
            <Ionicons name="chevron-back" size={12} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={goRight} hitSlop={10}>
            <Ionicons name="chevron-forward" size={12} color={Colors.text} />
          </TouchableOpacity>
          <Pagination.Basic
            progress={progresSharedValue}
            data={data as {}[]}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
            containerStyle={styles.paginationContainer}
            onPress={onPressPagination}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.imagePlaceholder,
    touchAction: 'pan-y',
  },
  dotStyle: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderRadius: 3,
  },
  activeDotStyle: {
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  paginationContainer: {
    gap: 6,
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  arrowLeft: {
    left: 10,
  },
  arrowRight: {
    right: 10,
  },
});
