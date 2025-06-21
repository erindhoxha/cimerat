import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
            title: "Listimet",
            tabBarActiveTintColor: Colors.light.tabIconSelected,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
