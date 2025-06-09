import React from "react";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Tabs",
          }}
        />
        <Tabs.Screen
          name="two"
          options={{
            title: "Tab Two",
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
