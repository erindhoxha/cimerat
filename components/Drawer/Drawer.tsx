import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
  Keyboard,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from '@/components/View/View';
import { Box } from '../Box';
import { Text } from '../Text';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../Button';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

interface TextLinkProps {
  label: string;
  onPress: () => void;
}

const TextLink = ({ label, onPress }: TextLinkProps) => (
  <Text style={styles.drawerText} onPress={onPress}>
    {label}
  </Text>
);

const Drawer = ({ open, onClose }: DrawerProps) => {
  const animation = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const [visible, setVisible] = useState(open);
  const [modalOpen, setModalOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
          <FontAwesome name="close" size={24} style={styles.closeIconInner} />
        </TouchableOpacity>

        <TextLink
          label="Faqja kryesore"
          onPress={() => {
            onClose();
            router.push('/');
          }}
        />
        {isLoggedIn && (
          <TextLink
            label="Listimet e mia"
            onPress={() => {
              onClose();
              router.push('/(tabs)/your-listings');
            }}
          />
        )}
        {isLoggedIn && (
          <TextLink
            label="Profili"
            onPress={() => {
              onClose();
              router.push('/profile');
            }}
          />
        )}

        <Box marginBottom={48} marginTop="auto">
          {!isLoggedIn && (
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => {
                onClose();
                router.push('/register');
              }}
            >
              <FontAwesome name="user-plus" size={16} />
              <Text fontWeight="medium">Regjistrohu</Text>
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
              <FontAwesome name="sign-in" size={16} />
              <Text fontWeight="medium">Kyçu</Text>
            </TouchableOpacity>
          )}

          <Modal
            onDismiss={() => setModalOpen(false)}
            visible={modalOpen}
            onRequestClose={() => setModalOpen(!modalOpen)}
            transparent
            presentationStyle="overFullScreen"
          >
            <TouchableOpacity
              onPressOut={() => setModalOpen(false)}
              onPressIn={() => undefined}
              activeOpacity={1}
              style={styles.modalOverlay}
            >
              <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                <Box marginBottom={8}>
                  <FontAwesome name="question" size={32} />
                </Box>
                <Text fontSize="lg" fontWeight="bold" style={styles.modalTitle}>
                  A jeni të sigurtë që dëshironi të dilni nga aplikacioni?
                </Text>
                <Text style={styles.modalSubtitle}>
                  Mund te hyni perseri ne cdo moment duke u kycur me kredencialet tuaja.
                </Text>
                <Box style={styles.modalButtonRow}>
                  <Button style={styles.modalButton} variant="tertiary" onPress={() => setModalOpen(false)}>
                    <Text>Jo, anulo</Text>
                  </Button>
                  <Button
                    style={styles.modalButton}
                    variant="danger"
                    onPress={() => {
                      onClose();
                      setAuth(null, null, null);
                      queryClient.clear();
                      setModalOpen(false);
                    }}
                  >
                    <Text>Po, dil</Text>
                  </Button>
                </Box>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

          {isLoggedIn && (
            <TouchableOpacity style={styles.linkButton} onPress={() => setModalOpen(true)}>
              <FontAwesome name="sign-out" size={16} />
              <Text fontWeight="medium">Dil</Text>
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
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 6,
    borderColor: 'white',
    marginBottom: 12,
  },
  closeIcon: {
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 9999,
    marginBottom: 20,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconInner: {
    height: 24,
    width: 24,
    textAlign: 'center',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: Colors.yellow,
    paddingHorizontal: 20,
    zIndex: 100,
    elevation: 12,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    width: '70%',
    maxWidth: 400,
  },
  drawerText: {
    padding: 10,
    marginBottom: 10,
    textAlign: 'left',
    color: 'black',
    borderBottomWidth: 2,
    fontSize: 20,
    fontWeight: '500',
  },
  modalOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    maxWidth: '90%',
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginTop: 120,
    alignSelf: 'center',
  },
  modalTitle: {
    textAlign: 'center',
  },
  modalSubtitle: {
    textAlign: 'center',
    marginTop: 12,
  },
  modalButtonRow: {
    marginTop: 12,
    gap: 12,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalButton: {
    flex: 1,
  },
});

export default Drawer;
