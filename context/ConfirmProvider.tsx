import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, Keyframe } from 'react-native-reanimated';

// Quick, subtle entrance: a small scale-up rather than zooming in from nothing
const cardEntering = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.92 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: Easing.out(Easing.cubic) },
}).duration(140);
import { Ionicons } from '@expo/vector-icons';
import { Box } from '@/components/Box';
import { Text } from '@/components/Text';
import Colors from '@/constants/Colors';

interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Red confirm button + warning icon, for deletes and sign-out */
  destructive?: boolean;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm>(async () => false);

// App-wide confirmation dialog, replacing the system Alert (which can't be styled and has no buttons on web)
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<((value: boolean) => void) | undefined>(undefined);

  const confirm = useCallback<Confirm>(
    (next) =>
      new Promise<boolean>((resolve) => {
        resolver.current = resolve;
        setOptions(next);
      }),
    [],
  );

  const close = (result: boolean) => {
    resolver.current?.(result);
    resolver.current = undefined;
    setOptions(null);
  };

  const destructive = options?.destructive ?? false;
  const accent = destructive ? Colors.danger : Colors.text;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal visible={!!options} transparent statusBarTranslucent animationType="none" onRequestClose={() => close(false)}>
        {options && (
          <Animated.View entering={FadeIn.duration(100)} exiting={FadeOut.duration(100)} style={styles.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => close(false)} accessibilityLabel="Mbyll" />
            <Animated.View entering={cardEntering} style={styles.card}>
              <Box style={[styles.iconCircle, { backgroundColor: destructive ? Colors.dangerSoft : Colors.accentSoft }]}>
                <Ionicons
                  name={options.icon ?? (destructive ? 'trash-outline' : 'help-circle-outline')}
                  size={24}
                  color={destructive ? Colors.danger : Colors.accentInk}
                />
              </Box>
              <Text style={styles.title}>{options.title}</Text>
              {!!options.message && <Text style={styles.message}>{options.message}</Text>}
              <Box flexDirection="row" gap={10} marginTop={22} alignSelf="stretch">
                <Pressable
                  onPress={() => close(false)}
                  style={({ pressed }) => [styles.button, styles.cancel, pressed && styles.pressed]}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelText}>{options.cancelLabel ?? 'Anulo'}</Text>
                </Pressable>
                <Pressable
                  onPress={() => close(true)}
                  style={({ pressed }) => [styles.button, { backgroundColor: accent }, pressed && styles.pressed]}
                  accessibilityRole="button"
                >
                  <Text style={styles.confirmText}>{options.confirmLabel ?? 'Po'}</Text>
                </Pressable>
              </Box>
            </Animated.View>
          </Animated.View>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(10,11,15,0.5)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 22,
    paddingBottom: 20,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
    color: Colors.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 21,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancel: {
    backgroundColor: Colors.lightGray,
  },
  pressed: {
    opacity: 0.8,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
