import * as React from 'react';
import { Dimensions, View, StyleProp, ViewStyle } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';

interface ReusableCarouselProps<T> {
  data: T[];
  renderItem: (props: { item: T; index: number }) => React.ReactElement;
  height?: number;
  width?: number;
  style?: StyleProp<ViewStyle>;
  onProgressChange?: (index: number) => void;
}

export function ReusableCarousel<T>({
  data,
  renderItem,
  height,
  width,
  style,
  onProgressChange,
}: ReusableCarouselProps<T>) {
  const ref = React.useRef<ICarouselInstance>(null);
  const progresSharedValue = useSharedValue<number>(0);

  const carouselWidth = width ?? Dimensions.get('window').width;
  const carouselHeight = height ?? carouselWidth / 2;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progresSharedValue.value,
      animated: true,
    });
  };

  return (
    <View style={style}>
      <Carousel
        ref={ref}
        width={carouselWidth}
        height={carouselHeight}
        data={data}
        onProgressChange={progresSharedValue}
        style={{
          touchAction: 'auto',
        }}
        onConfigurePanGesture={(panGesture) => {
          panGesture.activeOffsetX([-10, 10]);
        }}
        containerStyle={{
          touchAction: 'auto',
        }}
        renderItem={({ item, index }) => renderItem({ item, index })}
      />
      <Pagination.Custom
        activeDotStyle={{
          backgroundColor: 'rgba(255,255,255, 1)',
          borderRadius: 30,
        }}
        progress={progresSharedValue}
        data={data as {}[]}
        dotStyle={{ backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10, position: 'absolute', bottom: 12, touchAction: 'auto' }}
        onPress={onPressPagination}
      />
    </View>
  );
}
