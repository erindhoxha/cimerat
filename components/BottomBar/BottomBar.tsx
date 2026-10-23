import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '../Box';
import { Text } from '../Text';
import { CreateTabButton } from '../CreateTabButton/CreateTabButton';
import Colors from '@/constants/Colors';

export type TabName = 'index' | 'cimerat';

const TABS: { name: TabName; label: string; icon: 'home' | 'people'; size: number }[] = [
  { name: 'index', label: 'Dhomat', icon: 'home', size: 23 },
  { name: 'cimerat', label: 'Cimerat', icon: 'people', size: 25 },
];

interface BottomBarProps {
  /** Highlighted tab, or null on pages that aren't a tab (profile, details, forms…) */
  active: TabName | null;
  onSelect: (tab: TabName) => void;
}

// The one tab bar, used by the tab navigator and under every other page so it's always there
export const BottomBar = ({ active, onSelect }: BottomBarProps) => {
  const insets = useSafeAreaInsets();

  const renderTab = (tab: (typeof TABS)[number]) => {
    const focused = active === tab.name;
    const color = focused ? Colors.tabIconSelected : Colors.tabIconDefault;
    return (
      <Pressable
        key={tab.name}
        onPress={() => onSelect(tab.name)}
        style={styles.tab}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={tab.label}
      >
        <Ionicons name={focused ? tab.icon : `${tab.icon}-outline`} size={tab.size} color={color} />
        <Text style={[styles.label, { color }]}>{tab.label}</Text>
      </Pressable>
    );
  };

  return (
    <Box style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {renderTab(TABS[0])}
      <CreateTabButton />
      {renderTab(TABS[1])}
    </Box>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 8,
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    minHeight: 44,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
