import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import Colors from '@/constants/Colors';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Link, Stack, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export { ErrorBoundary } from 'expo-router';
import 'react-native-reanimated';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import DrawerProvider, { useDrawer } from '@/context/DrawerProvider';
import { ConfirmProvider } from '@/context/ConfirmProvider';
import { StatusBar } from 'expo-status-bar';
import { DownloadBanner } from '@/components/DownloadBanner/DownloadBanner';
import { Avatar } from '@/components/Avatar/Avatar';
import { BottomBar, TabName } from '@/components/BottomBar/BottomBar';
import { emitTabReselect } from '@/hooks/useTabReselect';
import { AnimatedSplash } from '@/components/AnimatedSplash/AnimatedSplash';
import { toastConfig } from '@/components/AppToast/AppToast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const isMobile = useWindowDimensions().width < 768;
  const insets = useSafeAreaInsets();

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...Ionicons.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <Box flex={1} backgroundColor="white">
      <AuthProvider>
        <StatusBar style="dark" />
        <QueryClientProvider client={queryClient}>
          <ConfirmProvider>
            <Box style={styles.customBackground}>
              <Box style={styles.customLayout}>
                {!isMobile && <DownloadBanner />}
                <DrawerProvider>
                  <RootLayoutNav />
                </DrawerProvider>
              </Box>
            </Box>
          </ConfirmProvider>
        </QueryClientProvider>
        <Toast
          config={toastConfig}
          position="top"
          topOffset={insets.top + 8}
          visibilityTime={3000}
          autoHide
          swipeable
        />
        <SplashGate />
      </AuthProvider>
    </Box>
  );
}

// Covers the app until the stored session is read. The navigator underneath must still mount:
// returning null from the root layout here made reloads land on "This screen doesn't exist".
function SplashGate() {
  const { loading } = useAuth();
  return <AnimatedSplash ready={!loading} />;
}

interface CustomHeaderProps {
  isWeb: boolean;
  isOpen: boolean;
  isLoggedIn: boolean;
  closeDrawer: () => void;
  openDrawer: () => void;
}

// Full-screen sheets that shouldn't have the tab bar under them
const NO_BOTTOM_BAR = ['/login', '/register'];

function RootLayoutNav() {
  const { openDrawer, closeDrawer, isOpen } = useDrawer();

  const { token } = useAuth();
  const { data: currentUser } = useCurrentUser();
  const router = useSafeRouter();

  const isLoggedIn = !!token;

  // Pages outside the tab navigator still get the bottom bar, so people can always jump back to a tab
  // The app's only bottom bar: rendered here, outside the navigators, so it stays put during transitions
  const pathname = usePathname();
  const showBottomBar = !NO_BOTTOM_BAR.some((path) => pathname.startsWith(path));
  const activeTab: TabName | null = pathname === '/' ? 'index' : pathname === '/cimerat' ? 'cimerat' : null;
  const goToTab = (tab: TabName) => {
    // Tapping the tab you're on scrolls it back to the top (see useTabReselect)
    if (tab === activeTab) return emitTabReselect(tab);
    if (router.canDismiss()) router.dismissAll();
    router.navigate(tab === 'index' ? '/' : '/cimerat');
  };

  return (
    <Box flex={1}>
      <Stack
        screenOptions={{
          headerStyle: styles.headerStyle,
          headerTintColor: Colors.text,
          headerTitleStyle: styles.headerTitleStyle,
          // Replaces the large native back chevron with one that matches the other header buttons
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <Pressable onPress={router.back} style={styles.headerIconButton} accessibilityLabel="Kthehu" hitSlop={8}>
                <Ionicons name="chevron-back" size={20} color={Colors.text} />
              </Pressable>
            ) : null,
          headerShadowVisible: false,
          headerTitle: () => (
            <Text style={styles.logo}>
              cimerat<Text style={styles.logoDot}>.</Text>
            </Text>
          ),
          headerRight: () => (
            <Box gap={6} flexDirection="row" alignItems="center" justifyContent="flex-end" marginRight={0}>
              <Link href="/liked" asChild>
                <TouchableOpacity style={styles.headerIconButton} accessibilityLabel="Të preferuarat">
                  <Ionicons name="heart-outline" size={19} color={Colors.text} />
                </TouchableOpacity>
              </Link>
              {isLoggedIn ? (
                <Link href="/profile" asChild>
                  <TouchableOpacity accessibilityLabel="Profili">
                    <Avatar user={currentUser?.user} size={34} linked={false} />
                  </TouchableOpacity>
                </Link>
              ) : (
                <Link href="/login" asChild>
                  <TouchableOpacity style={styles.headerIconButton} accessibilityLabel="Kyçu">
                    <Ionicons name="person-outline" size={20} color={Colors.text} />
                  </TouchableOpacity>
                </Link>
              )}
              <Pressable
                onPress={isOpen ? closeDrawer : openDrawer}
                style={styles.headerIconButton}
                accessibilityLabel="Menyja"
              >
                <Ionicons name={isOpen ? 'close' : 'menu-outline'} size={22} color={Colors.text} />
              </Pressable>
            </Box>
          ),
        }}
      >
        <Stack.Screen name="(item)/[item]" />
        <Stack.Screen name="(tabs)" />
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="login/index"
            options={{
              presentation: 'modal',
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="register/index"
            options={{
              presentation: 'modal',
              contentStyle: {
                backgroundColor: 'transparent',
              },
            }}
          />
        </Stack.Protected>
        <Stack.Screen name="user/[id]" />
        {/* Account-only pages render a login prompt when logged out (see RequireAuth) instead of a blank page */}
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="cimerat/create" />
      </Stack>
      {showBottomBar && <BottomBar active={activeTab} onSelect={goToTab} />}
    </Box>
  );
}

const styles = StyleSheet.create({
  customLayout: {
    overflow: 'hidden',
    maxWidth: 1028,
    width: '100%',
    backgroundColor: 'transparent',
    height: '100%',
  },
  customBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  customHeaderWrapper: {
    width: '100%',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customHeaderInner: {
    backgroundColor: Colors.surface,
    maxWidth: 1028,
    paddingHorizontal: 20,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: Colors.text,
  },
  logoDot: {
    color: Colors.accent,
  },
  headerStyle: {
    backgroundColor: Colors.surface,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  sideIcon: {},
  headerIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
  },
  hamburgerMenu: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
});
