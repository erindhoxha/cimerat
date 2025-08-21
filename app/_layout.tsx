import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Link, Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform, Pressable, StyleSheet, TouchableOpacity, useColorScheme, useWindowDimensions } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
export { ErrorBoundary } from 'expo-router';
import 'react-native-reanimated';
import { Text } from '@/components/Text';
import { Box } from '@/components/Box';
import Toast from 'react-native-toast-message';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import DrawerProvider, { useDrawer } from '@/context/DrawerProvider';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Box flex={1} backgroundColor="white">
      <AuthProvider>
        <StatusBar style="dark" />
        <QueryClientProvider client={queryClient}>
          <DrawerProvider>
            <RootLayoutNav />
          </DrawerProvider>
        </QueryClientProvider>
        <Toast position="bottom" bottomOffset={40} type="info" autoHide swipeable />
      </AuthProvider>
    </Box>
  );
}

interface CustomHeaderProps {
  isWeb: boolean;
  isLoggedIn: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isOpen: boolean;
}

function CustomHeader({ isWeb, isLoggedIn, openDrawer, closeDrawer, isOpen }: CustomHeaderProps) {
  const router = useRouter();
  return (
    <Box
      style={{
        width: '100%',
        backgroundColor: Colors.yellow,
        height: 56,
        justifyContent: 'center',
      }}
    >
      <Box
        style={
          isWeb
            ? {
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
              }
            : {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 56,
                width: '100%',
              }
        }
      >
        {router.canGoBack() && (
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <FontAwesome name="chevron-left" size={16} color={Colors.text} /> <Text fontSize="md">Kthehu</Text>
          </Pressable>
        )}
        <Text style={styles.logo}>Cimerat</Text>
        <Box flexDirection="row" alignItems="center" gap={12}>
          <Box>
            {isLoggedIn ? (
              <Link href="/profile" asChild>
                <TouchableOpacity>
                  <FontAwesome name="user-circle-o" size={24} color={Colors.text} />
                </TouchableOpacity>
              </Link>
            ) : (
              <Link href="/login" asChild>
                <TouchableOpacity>
                  <FontAwesome name="user-circle-o" size={24} color={Colors.text} />
                </TouchableOpacity>
              </Link>
            )}
          </Box>
          <Pressable onPress={isOpen ? closeDrawer : openDrawer} style={styles.hamburgerMenu}>
            <FontAwesome name={isOpen ? 'close' : 'navicon'} size={24} color={Colors.text} />
          </Pressable>
        </Box>
      </Box>
    </Box>
  );
}

function RootLayoutNav() {
  const { openDrawer, closeDrawer, isOpen } = useDrawer();

  const { token } = useAuth();

  const isWeb = Platform.OS === 'web';

  const isLoggedIn = !!token;

  return (
    <Stack
      screenOptions={{
        headerStyle: styles.headerStyle,
        headerTintColor: Colors.text,
        headerTitleStyle: styles.headerTitleStyle,
        headerBackTitle: 'Back',
        ...(isWeb && {
          header: () => (
            <CustomHeader
              isWeb={isWeb}
              isLoggedIn={isLoggedIn}
              openDrawer={openDrawer}
              closeDrawer={closeDrawer}
              isOpen={isOpen}
            />
          ),
        }),
        headerTitle: () => <Text style={styles.logo}>Cimerat</Text>,
        headerRight: () => (
          <Box
            gap={12}
            flexDirection="row"
            alignItems="flex-end"
            justifyContent="flex-end"
            marginRight={isWeb ? 12 : 0}
          >
            <Box>
              {isLoggedIn ? (
                <Link href="/profile" asChild>
                  <TouchableOpacity>
                    <FontAwesome name="user-circle-o" size={24} color={Colors.text} />
                  </TouchableOpacity>
                </Link>
              ) : (
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <FontAwesome name="user-circle-o" size={24} color={Colors.text} />
                  </TouchableOpacity>
                </Link>
              )}
            </Box>
            <Pressable onPress={isOpen ? closeDrawer : openDrawer} style={styles.hamburgerMenu}>
              <FontAwesome name={isOpen ? 'close' : 'navicon'} size={24} color={Colors.text} />
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
            headerShown: isWeb,
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
            headerShown: isWeb,
            contentStyle: {
              backgroundColor: 'transparent',
            },
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="profile/index" />
      </Stack.Protected>
    </Stack>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerStyle: {
    backgroundColor: Colors.yellow,
  },
  headerTitleStyle: {
    fontWeight: 'bold',
  },
  sideIcon: {},
  hamburgerMenu: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
