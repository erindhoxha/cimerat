import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Link, Stack } from 'expo-router';
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
        headerTitle: () => <Text style={styles.logo}>Cimerat</Text>,
        headerRight: () => (
          <Box
            style={styles.headerRightBox}
            gap={12}
            flexDirection="row"
            alignItems="flex-end"
            justifyContent="flex-end"
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
  headerRightBox: {
    width: 'auto',
  },
  sideIcon: {},
  hamburgerMenu: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
  },
});
