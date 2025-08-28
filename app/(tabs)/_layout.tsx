import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { Box } from '@/components/Box';

export default function TabLayout() {
  const isWeb = Platform.OS === 'web';
  return (
    <Box
      flex={1}
      backgroundColor="white"
      style={
        isWeb
          ? {
              maxWidth: 1028,
              width: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'flex',
              justifyContent: 'space-between',
            }
          : undefined
      }
    >
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
              title: 'Listimet',
              tabBarActiveTintColor: Colors.tint,
              tabBarInactiveTintColor: Colors.darkYellow,
            }}
          />
          <Tabs.Screen
            name="liked"
            options={{
              title: 'Të ruajturat',
              tabBarIcon: ({ color }) => <FontAwesome name="heart" size={24} color={color} />,
              tabBarActiveTintColor: Colors.tint,
              tabBarInactiveTintColor: Colors.darkYellow,
            }}
          />
          <Tabs.Screen
            name="your-listings"
            options={{
              title: 'Krijo',
              tabBarIcon: ({ color }) => <FontAwesome name="plus" size={24} color={color} />,
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
