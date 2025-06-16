import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
            title: "Listimet",
          }}
        />
        <Tabs.Screen
          name="your-listings"
          options={{
            title: "Krijo",
            tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} />,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
