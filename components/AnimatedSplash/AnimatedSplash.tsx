import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import Colors from '@/constants/Colors';

interface AnimatedSplashProps {
  /** When true the splash plays its exit animation and unmounts */
  ready: boolean;
}

// Matches the native splash (same background + wordmark) so the hand-off is invisible,
// then keeps the brand on screen until the app has what it needs to render.
export const AnimatedSplash = ({ ready }: AnimatedSplashProps) => {
  const [done, setDone] = useState(false);
  const dot = useSharedValue(1);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    dot.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 420, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 420, easing: Easing.in(Easing.quad) }),
      ),
      -1,
    );
  }, []);

  useEffect(() => {
    if (!ready) return;
    scale.value = withTiming(1.08, { duration: 450, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(setDone)(true);
    });
  }, [ready]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const dotStyle = useAnimatedStyle(() => ({ transform: [{ scale: dot.value }] }));

  if (done) return null;

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      pointerEvents={ready ? 'none' : 'auto'}
      onLayout={() => SplashScreen.hideAsync()}
    >
      {/* Same wordmark as the header logo, just larger: dark "cimerat" + yellow period */}
      <Animated.View style={[styles.logo, logoStyle]}>
        <Animated.Text style={styles.wordmark}>cimerat</Animated.Text>
        <Animated.Text style={[styles.wordmark, styles.dot, dotStyle]}>.</Animated.Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  // Header logo is 22pt with -0.6 letter spacing; scaled up proportionally
  wordmark: {
    fontSize: 52,
    fontWeight: '800',
    letterSpacing: -1.4,
    color: Colors.text,
  },
  dot: {
    color: Colors.accent,
  },
});
