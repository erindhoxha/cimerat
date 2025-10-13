import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';
import { Box } from '@/components/Box';

export default function TabLayout() {
  return (
    <Box flex={1} backgroundColor="white">
      <GestureHandlerRootView style={[styles.container]}>
        <Tabs
          initialRouteName="index"
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: Colors.yellow,
              borderTopColor: 'transparent',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
              title: 'Faqja kryesore',
              tabBarActiveTintColor: Colors.tint,
              tabBarInactiveTintColor: Colors.darkYellow,
            }}
          />
          <Tabs.Screen
            name="your-listings"
            options={{
              title: 'Listimet e mia',
              tabBarIcon: ({ color }) => <FontAwesome name="plus-circle" size={24} color={color} />,
              tabBarActiveTintColor: Colors.tint,
              tabBarInactiveTintColor: Colors.darkYellow,
            }}
          />
          <Tabs.Screen
            name="liked"
            options={{
              title: 'Të preferuarat',
              tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} />,
              tabBarActiveTintColor: Colors.tint,
              tabBarInactiveTintColor: Colors.darkYellow,
            }}
          />
        </Tabs>
      </GestureHandlerRootView>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
