import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Box } from '@/components/Box';

export default function TabLayout() {
  return (
    <Box flex={1} backgroundColor="white">
      <GestureHandlerRootView style={[styles.container]}>
        <Tabs
          initialRouteName="index"
          screenOptions={{ headerShown: false }}
          // The single bottom bar is rendered by the root layout (app/_layout.tsx) so it never
          // appears twice during page transitions
          tabBar={() => null}
        >
          <Tabs.Screen name="index" options={{ title: 'Dhomat' }} />
          <Tabs.Screen name="cimerat" options={{ title: 'Cimerat' }} />
          {/* Still routable (header heart, drawer, profile), just not in the tab bar */}
          <Tabs.Screen name="your-listings" options={{ title: 'Listimet e mia' }} />
          <Tabs.Screen name="liked" options={{ title: 'Të preferuarat' }} />
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
