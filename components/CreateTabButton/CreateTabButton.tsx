import { useState } from 'react';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Modal, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '../Box';
import { Text } from '../Text';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const OPTIONS: { title: string; description: string; icon: IconName; href: '/create' | '/cimerat/create' }[] = [
  {
    title: 'Posto një dhomë',
    description: 'Keni një dhomë të lirë? Gjeni cimerin e duhur.',
    icon: 'home-outline',
    href: '/create',
  },
  {
    title: 'Posto veten si cimer',
    description: 'Po kërkoni dhomë? Lërini të tjerët t’ju gjejnë.',
    icon: 'person-outline',
    href: '/cimerat/create',
  },
];

// Raised "+" in the middle of the tab bar; opens a chooser instead of navigating to a tab
export const CreateTabButton = () => {
  const [open, setOpen] = useState(false);
  const router = useSafeRouter();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const go = (href: (typeof OPTIONS)[number]['href']) => {
    setOpen(false);
    router.push(token ? href : '/login');
  };

  return (
    <Box style={styles.slot}>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel="Posto"
        hitSlop={8}
      >
        <Ionicons name="add" size={28} color={Colors.text} />
      </Pressable>

      <Modal visible={open} transparent statusBarTranslucent animationType="none" onRequestClose={() => setOpen(false)}>
        <Animated.View entering={FadeIn.duration(180)} style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} accessibilityLabel="Mbyll" />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.duration(220)}
          style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}
        >
          <Box style={styles.grabber} />
          <Text style={styles.title}>Çfarë dëshironi të postoni?</Text>
          <Box gap={10}>
            {OPTIONS.map((option) => (
              <Pressable
                key={option.href}
                onPress={() => go(option.href)}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              >
                <Box style={styles.optionIcon}>
                  <Ionicons name={option.icon} size={22} color={Colors.text} />
                </Box>
                <Box flex={1}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </Box>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </Pressable>
            ))}
          </Box>
        </Animated.View>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: -18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderWidth: 4,
    borderColor: Colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,11,15,0.45)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.surface,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionPressed: {
    backgroundColor: Colors.background,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentSoft,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  optionDescription: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
