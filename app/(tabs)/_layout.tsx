import React from "react";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].yellow,
          },
          headerTintColor: Colors[colorScheme ?? "light"].text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "Cimerat",
        }}>
        <Stack.Screen
          name="index"
          options={{
            title: "Tabs",
          }}
        />
        <Stack.Screen
          name="two"
          options={{
            title: "Tab Two",
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
