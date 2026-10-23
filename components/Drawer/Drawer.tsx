import Colors from '@/constants/Colors';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Animated, Dimensions, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from '@/components/View/View';
import { Box } from '../Box';
import { Text } from '../Text';
import { useAuth } from '../../context/AuthContext';
import { useConfirm } from '../../context/ConfirmProvider';
import { useQueryClient } from '@tanstack/react-query';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

interface TextLinkProps {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}

const TextLink = ({ label, icon, onPress }: TextLinkProps) => (
  <TouchableOpacity style={styles.drawerLink} onPress={onPress}>
    <Ionicons name={icon} size={18} color={Colors.text} style={styles.drawerLinkIcon} />
    <Text style={styles.drawerText}>{label}</Text>
  </TouchableOpacity>
);

const Drawer = ({ open, onClose }: DrawerProps) => {
  const animation = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [visible, setVisible] = useState(open);
  const confirm = useConfirm();
  const insets = useSafeAreaInsets();
  const router = useSafeRouter();

  const { token, setAuth } = useAuth();
  const isLoggedIn = !!token;
  const queryClient = useQueryClient();

  useEffect(() => {
    Keyboard.dismiss();
    if (open) {
      setVisible(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: -DRAWER_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }
  }, [open]);

  const signOut = async () => {
    const ok = await confirm({
      title: 'Dil nga llogaria?',
      message: 'Mund të hyni përsëri në çdo moment me kredencialet tuaja.',
      confirmLabel: 'Po, dil',
      destructive: true,
      icon: 'log-out-outline',
    });
    if (!ok) return;
    onClose();
    setAuth(null, null, null);
    queryClient.clear();
  };

  if (!visible) return null;

  return (
    <>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: animation }],
            paddingTop: insets.top + 20,
            left: 0,
          },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
          <Ionicons name="close" size={18} color={Colors.text} />
        </TouchableOpacity>

        <TextLink
          label="Dhomat"
          icon="home-outline"
          onPress={() => {
            onClose();
            router.push('/');
          }}
        />
        <TextLink
          label="Cimerat"
          icon="people-outline"
          onPress={() => {
            onClose();
            router.push('/(tabs)/cimerat');
          }}
        />
        {isLoggedIn && (
          <TextLink
            label="Listimet e mia"
            icon="albums-outline"
            onPress={() => {
              onClose();
              router.push({ pathname: '/profile', params: { tab: 'listings' } });
            }}
          />
        )}
        <TextLink
          label="Të preferuarat"
          icon="heart-outline"
          onPress={() => {
            onClose();
            router.push('/liked');
          }}
        />
        {isLoggedIn && (
          <TextLink
            label="Profili"
            icon="person-outline"
            onPress={() => {
              onClose();
              router.push({ pathname: '/profile', params: { tab: 'profile' } });
            }}
          />
        )}

        <Box marginBottom={48} marginTop="auto">
          {!isLoggedIn && (
            <TouchableOpacity
              style={[styles.linkButton, styles.linkButtonPrimary]}
              onPress={() => {
                onClose();
                router.push('/register');
              }}
            >
              <Ionicons name="person-add-outline" size={16} color={Colors.onPrimary} />
              <Text fontWeight="semibold" style={styles.linkButtonPrimaryText}>
                Regjistrohu
              </Text>
            </TouchableOpacity>
          )}
          {!isLoggedIn && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                onClose();
                router.push('/login');
              }}
            >
              <Ionicons name="log-in-outline" size={16} color={Colors.text} />
              <Text fontWeight="semibold">Kyçu</Text>
            </TouchableOpacity>
          )}

          {isLoggedIn && (
            <TouchableOpacity style={styles.linkButton} onPress={signOut}>
              <Ionicons name="log-out-outline" size={16} color={Colors.danger} />
              <Text fontWeight="semibold" style={styles.signOutText}>
                Dil
              </Text>
            </TouchableOpacity>
          )}
        </Box>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99,
  },
  linkButton: {
    minHeight: 48,
    padding: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 8,
    borderColor: Colors.borderStrong,
    marginBottom: 12,
  },
  linkButtonPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  linkButtonPrimaryText: {
    color: Colors.onPrimary,
  },
  signOutText: {
    color: Colors.danger,
  },
  closeIcon: {
    width: 36,
    height: 36,
    backgroundColor: Colors.lightGray,
    borderRadius: 18,
    marginBottom: 24,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  drawerLinkIcon: {
    width: 22,
    textAlign: 'center',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    zIndex: 100,
    elevation: 12,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '70%',
    maxWidth: 400,
  },
  drawerText: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '500',
  },
});

export default Drawer;
