import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconsName;
  color: string;
  focused: boolean;
  activeColor?: string;
}

function TabIcon({ name, color, focused, activeColor }: TabIconProps) {
  const bgColor = activeColor ? `${activeColor}1E` : 'rgba(0, 212, 170, 0.12)';
  return (
    <View style={[styles.iconContainer, focused && { ...styles.iconContainerFocused, backgroundColor: bgColor }]}>
      <Ionicons name={name} size={24} color={color} />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#00D4AA',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: styles.tabLabel,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'scan' : 'scan-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'time' : 'time-outline'} color={color} focused={focused} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="speak"
        options={{
          title: 'Voice',
          tabBarActiveTintColor: '#A78BFA',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              name={focused ? 'volume-high' : 'volume-high-outline'}
              color={color}
              focused={focused}
              activeColor="#A78BFA"
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'information-circle' : 'information-circle-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#111827',
    borderTopColor: '#1F2937',
    borderTopWidth: 1,
    height: 70,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  iconContainer: {
    width: 40,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconContainerFocused: {
    backgroundColor: 'rgba(0, 212, 170, 0.12)',
  },
});
