import { useEffect, useRef, useState } from 'react';
import { Dimensions, View, StyleProp, ViewStyle, StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native';
import { useSharedValue, configureReanimatedLogger } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';

// disable warnings
configureReanimatedLogger({
  strict: false,
});

interface ReusableCarouselProps<T> {
  data: T[];
  renderItem: (props: { item: T; index: number }) => React.ReactElement;
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
  defaultIndex?: number;
  onProgressChange?: (index: number) => void;
  controlledIndex?: number;
}

export function MobileCarousel<T>({
  data,
  renderItem,
  height,
  width,
  style,
  defaultIndex,
  onProgressChange,
  controlledIndex,
}: ReusableCarouselProps<T>) {
  const ref = useRef<ICarouselInstance>(null);
  const progresSharedValue = useSharedValue<number>(0);
  const [currentIndex, setCurrentIndex] = useState(defaultIndex ?? 0);

  useEffect(() => {
    if (typeof controlledIndex === 'number' && controlledIndex !== currentIndex) {
      setCurrentIndex(controlledIndex);
      ref.current?.scrollTo({
        count: controlledIndex - progresSharedValue.value,
        animated: true,
      });
    }
  }, [controlledIndex]);

  const carouselWidth = width ?? Dimensions.get('window').width;
  const carouselHeight = height ?? carouselWidth / 2;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progresSharedValue.value,
      animated: true,
    });
  };

  const isCarousel = data.length > 1;

  const goLeft = () => {
    if (!isCarousel) return;
    const nextIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    setCurrentIndex(nextIndex);
    ref.current?.scrollTo({
      count: nextIndex - progresSharedValue.value,
      animated: true,
    });
  };

  const goRight = () => {
    if (!isCarousel) return;
    const nextIndex = currentIndex === data.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    ref.current?.scrollTo({
      count: nextIndex - progresSharedValue.value,
      animated: true,
    });
  };

  return (
    <View style={{ touchAction: 'pan-y', position: 'relative' }}>
      {isCarousel && (
        <>
          <TouchableOpacity style={[styles.arrow, styles.arrowLeft]} onPress={goLeft} hitSlop={10}>
            <Text style={styles.arrowText}>{'‹'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.arrow, styles.arrowRight]} onPress={goRight} hitSlop={10}>
            <Text style={styles.arrowText}>{'›'}</Text>
          </TouchableOpacity>
        </>
      )}
      <Carousel
        ref={ref}
        width={carouselWidth}
        height={carouselHeight}
        defaultIndex={defaultIndex}
        data={data}
        onProgressChange={(_, absoluteProgress) => {
          progresSharedValue.value = absoluteProgress;
          const rounded = Math.round(absoluteProgress);
          setCurrentIndex(rounded);
          onProgressChange?.(rounded);
        }}
        onConfigurePanGesture={(panGesture) => {
          panGesture.activeOffsetX([-10, 10]);
        }}
        style={[style]}
        enabled={isCarousel}
        renderItem={({ item, index }) => renderItem({ item, index })}
      />
      {isCarousel && (
        <Pagination.Custom
          activeDotStyle={styles.activeDotStyle}
          progress={progresSharedValue}
          data={data as {}[]}
          dotStyle={styles.dotStyle}
          containerStyle={styles.containerStyle}
          onPress={onPressPagination}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  activeDotStyle: {
    backgroundColor: 'rgba(255,255,255, 1)',
    borderRadius: 30,
  },
  dotStyle: { backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 50 },
  containerStyle: { gap: 5, marginTop: 10, position: 'absolute', bottom: 12, touchAction: 'auto' },
  arrow: {
    position: 'absolute',
    top: '50%',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 100,
    padding: 12,
    marginTop: -24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: {
    left: 10,
  },
  arrowRight: {
    right: 10,
  },
  arrowText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 36,
    lineHeight: 36,
  },
});
