import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import * as SplashScreen from "expo-splash-screen";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, Redirect, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DrawerProvider, { useDrawer } from "../context/DrawerProvider";
export { ErrorBoundary } from "expo-router";
import "react-native-reanimated";
import { Text } from "@/components/Text";
import { Box } from "@/components/Box";
import Toast from "react-native-toast-message";
import { AuthProvider, useAuth } from "@/components/context/AuthContext";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
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
    <Box flex={1}>
      <AuthProvider>
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
  const colorScheme = useColorScheme();
  const { openDrawer, closeDrawer, isOpen } = useDrawer();

  const { token } = useAuth();

  const isLoggedIn = !!token;
  const router = useRouter();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors["light"].yellow,
          },
          headerTintColor: Colors["light"].text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerBackTitle: "Back",
          headerTitle: () => {
            return <Text style={styles.logo}>cimerat.com</Text>;
          },
          headerRight: () => (
            <Box
              style={{
                width: "auto",
              }}
              flexDirection="row"
              gap={12}
              alignItems="flex-end"
              justifyContent="flex-end">
              <Box>
                {isLoggedIn ? (
                  <Link href="/profile" style={styles.sideIcon}>
                    <FontAwesome name="user-circle-o" size={24} color={Colors[colorScheme ?? "light"].text} />
                  </Link>
                ) : (
                  <Link href="/login" style={styles.sideIcon}>
                    <FontAwesome name="user-circle-o" size={24} color={Colors[colorScheme ?? "light"].text} />
                  </Link>
                )}
              </Box>
              <Pressable onPress={isOpen ? closeDrawer : openDrawer} style={styles.hamburgerMenu}>
                <FontAwesome
                  name={isOpen ? "close" : "navicon"}
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </Pressable>
            </Box>
          ),
        }}>
        <Stack.Screen
          name="(item)/[item]"
          // options={{
          //   presentation: "modal",
          //   headerBackButtonMenuEnabled: true,
          //   headerRight: undefined,
          //   headerLeft: () => (
          //     <Box
          //       style={{
          //         width: "auto",
          //       }}
          //       flexDirection="row"
          //       gap={12}
          //       alignItems="flex-end"
          //       justifyContent="flex-end">
          //       <Text
          //         fontSize="md"
          //         onPress={() => {
          //           router.back();
          //         }}>
          //         Back
          //       </Text>
          //     </Box>
          //   ),
          //   contentStyle: {
          //     backgroundColor: "transparent",
          //   },
          // }}
        />
        <Stack.Screen name="(tabs)" />
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="login/index"
            options={{
              presentation: "modal",
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen
            name="register/index"
            options={{
              presentation: "modal",
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen
            name="profile/index"
            options={{
              presentation: "modal",
              headerShown: false,
              contentStyle: {
                backgroundColor: "transparent",
              },
            }}
          />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sideIcon: {},
  hamburgerMenu: {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
  },
});
