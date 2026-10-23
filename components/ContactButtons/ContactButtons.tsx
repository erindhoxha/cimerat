import { Linking, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Box } from '../Box';
import { Text } from '../Text';
import Colors from '@/constants/Colors';
import { toE164 } from '@/utils';

interface ContactButtonsProps {
  phone: string;
  /** Prefilled WhatsApp text, e.g. which post they're replying to */
  message?: string;
}

const open = async (url: string, appName?: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    Toast.show({
      type: 'error',
      text1: appName ? `${appName} nuk është i instaluar` : 'Nuk mund të hapet',
    });
  }
};

// Call / WhatsApp / Viber: the ways people in Kosovo actually reach each other
export const ContactButtons = ({ phone, message }: ContactButtonsProps) => {
  const e164 = toE164(phone);
  const digits = e164.replace('+', '');

  return (
    <Box flexDirection="row" gap={8}>
      <Pressable
        style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}
        onPress={() => open(`tel:${e164}`)}
        accessibilityLabel="Telefono"
      >
        <Ionicons name="call" size={16} color={Colors.onPrimary} />
        <Text style={[styles.label, styles.primaryLabel]}>Telefono</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.button, styles.whatsapp, pressed && styles.pressed]}
        onPress={() =>
          open(`https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`, 'WhatsApp')
        }
        accessibilityLabel="WhatsApp"
      >
        <Ionicons name="logo-whatsapp" size={17} color={Colors.white} />
        <Text style={[styles.label, styles.primaryLabel]}>WhatsApp</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.button, styles.viber, pressed && styles.pressed]}
        onPress={() => open(`viber://chat?number=${encodeURIComponent(e164)}`, 'Viber')}
        accessibilityLabel="Viber"
      >
        <Ionicons name="chatbubble-ellipses" size={16} color={Colors.white} />
        <Text style={[styles.label, styles.primaryLabel]}>Viber</Text>
      </Pressable>
    </Box>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  whatsapp: {
    backgroundColor: '#25D366',
  },
  viber: {
    backgroundColor: '#7360F2',
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryLabel: {
    color: Colors.white,
  },
});
