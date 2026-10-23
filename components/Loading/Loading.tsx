import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Box } from '../Box';
import { Text } from '../Text';
import { WebView } from '../WebView/WebView';
import Colors from '@/constants/Colors';

interface LoadingProps {
  title?: string;
}

const DOT_COLORS = [Colors.primary, Colors.primary, Colors.accent];

const Dot = ({ index }: { index: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 140,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 320, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: 320, easing: Easing.in(Easing.quad) }),
          withTiming(0, { duration: 200 }),
        ),
        -1,
      ),
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 0.35 + progress.value * 0.65,
    transform: [{ translateY: -8 * progress.value }],
  }));

  return <Animated.View style={[styles.dot, { backgroundColor: DOT_COLORS[index] }, style]} />;
};

export const Loading: React.FC<LoadingProps> = ({ title }) => {
  return (
    <WebView>
      <Box style={styles.container} accessibilityRole="progressbar" accessibilityLabel={title || 'Duke ngarkuar'}>
        <Box style={styles.dots}>
          {DOT_COLORS.map((_, index) => (
            <Dot key={index} index={index} />
          ))}
        </Box>
        <Text style={styles.text}>{title || 'Duke ngarkuar...'}</Text>
      </Box>
    </WebView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 14,
    paddingVertical: 24,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 22,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
