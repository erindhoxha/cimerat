import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Appearance } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? "light"].yellow,
          },
          headerTintColor: Colors[colorScheme ?? "light"].text,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitle: "Cimerat",
          drawerType: "back",
        }}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "Tabs",
          }}
        />

        <Drawer.Screen
          name="two"
          listeners={{
            drawerItemPress: (e) => {
              e.preventDefault();
              console.log("Drawer item pressed");
              if (colorScheme === "dark") {
                Appearance.setColorScheme("light");
              } else {
                Appearance.setColorScheme("dark");
              }
            },
          }}
          options={{
            drawerLabel: "Toggle Theme",
            title: "Toggle Theme",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
