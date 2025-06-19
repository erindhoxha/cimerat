import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import { Pressable, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import { Text, View } from "@/components/Themed";
import { DrawerProvider, useDrawer } from "@/components/context/DrawerProvider";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
    <View style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <DrawerProvider>
          <RootLayoutNav />
        </DrawerProvider>
      </QueryClientProvider>
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { openDrawer, closeDrawer, isOpen } = useDrawer();
  const router = useRouter();
  const segments = useSegments();

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
              <Pressable
                onPress={() => {
                  if (segments[0] === "profile") {
                    return;
                  }
                  router.push("/profile");
                }}
                style={styles.sideIcon}>
                <FontAwesome name="user-circle-o" size={24} color={Colors[colorScheme ?? "light"].text} />
              </Pressable>
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
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
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
