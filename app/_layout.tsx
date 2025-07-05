import FontAwesome from "@expo/vector-icons/FontAwesome";
import Colors from "@/constants/Colors";
import * as SplashScreen from "expo-splash-screen";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DrawerProvider, { useDrawer } from "../context/DrawerProvider";
export { ErrorBoundary } from "expo-router";
import "react-native-reanimated";
import { Text } from "@/components/Text";
import { Box } from "@/components/Box";
import Toast from "react-native-toast-message";
import { AuthProvider } from "@/components/context/AuthContext";

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
            <>
              <Link href="/profile" style={styles.sideIcon}>
                <FontAwesome name="user-circle-o" size={24} color={Colors[colorScheme ?? "light"].text} />
              </Link>
              <Pressable onPress={isOpen ? closeDrawer : openDrawer} style={styles.sideIcon}>
                <FontAwesome
                  name={isOpen ? "close" : "navicon"}
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </Pressable>
            </>
          ),
        }}>
        <Stack.Screen name="(item)/[item]" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login/index" />
        <Stack.Screen name="register/index" />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sideIcon: {
    marginRight: 16,
  },
});
