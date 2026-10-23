import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastConfig, ToastConfigParams } from 'react-native-toast-message';
import { Box } from '../Box';
import { Text } from '../Text';
import Colors from '@/constants/Colors';

type Variant = 'success' | 'error' | 'info';

const VARIANTS: Record<Variant, { icon: React.ComponentProps<typeof Ionicons>['name']; color: string; soft: string }> = {
  success: { icon: 'checkmark-circle', color: Colors.green, soft: Colors.greenSoft },
  error: { icon: 'alert-circle', color: Colors.danger, soft: Colors.dangerSoft },
  info: { icon: 'information-circle', color: Colors.accentInk, soft: Colors.accentSoft },
};

const AppToast = ({ variant, text1, text2 }: ToastConfigParams<unknown> & { variant: Variant }) => {
  const { icon, color, soft } = VARIANTS[variant];
  return (
    <Box style={styles.toast} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <Box style={[styles.iconCircle, { backgroundColor: soft }]}>
        <Ionicons name={icon} size={20} color={color} />
      </Box>
      <Box flex={1}>
        {!!text1 && (
          <Text style={styles.title} numberOfLines={2}>
            {text1}
          </Text>
        )}
        {!!text2 && (
          <Text style={styles.message} numberOfLines={3}>
            {text2}
          </Text>
        )}
      </Box>
    </Box>
  );
};

// Shown at the top (see app/_layout.tsx) so it never covers buttons or the tab bar
export const toastConfig: ToastConfig = {
  success: (props) => <AppToast {...props} variant="success" />,
  error: (props) => <AppToast {...props} variant="error" />,
  info: (props) => <AppToast {...props} variant="info" />,
};

const styles = StyleSheet.create({
  toast: {
    width: '92%',
    maxWidth: 480,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: 16,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
