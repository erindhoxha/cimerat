import { StyleSheet } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Ionicons } from '@expo/vector-icons';
import { Box } from '../Box';
import { Text } from '../Text';
import { Button } from '../Button';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

interface RequireAuthProps {
  children: React.ReactNode;
  /** What the person was trying to do, e.g. "postuar një dhomë" */
  reason?: string;
}

// Renders children only when logged in; otherwise a clear prompt instead of a blank page
export const RequireAuth = ({ children, reason = 'vazhduar' }: RequireAuthProps) => {
  const { token, loading } = useAuth();
  const router = useSafeRouter();

  if (loading) return null;
  if (token) return <>{children}</>;

  return (
    <Box style={styles.container}>
      <Box style={styles.icon}>
        <Ionicons name="person-outline" size={28} color={Colors.text} />
      </Box>
      <Text style={styles.title}>Kyçuni për të {reason}</Text>
      <Text style={styles.text}>Krijimi i llogarisë është falas dhe zgjat më pak se një minutë.</Text>
      <Box alignSelf="stretch" gap={10} marginTop={8}>
        <Button icon="log-in-outline" onPress={() => router.push('/login')}>
          Kyçu
        </Button>
        <Button variant="tertiary" onPress={() => router.push('/register')}>
          Krijo llogari
        </Button>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 32,
    backgroundColor: Colors.surface,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentSoft,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
