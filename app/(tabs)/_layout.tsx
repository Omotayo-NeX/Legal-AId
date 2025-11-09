import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../../src/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.white,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(27, 170, 102, 0.85)',
          borderTopWidth: 0,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          height: Platform.OS === 'ios' ? 85 : 70,
          elevation: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),
          headerTitle: 'AI Assistant',
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color }) => (
            <Ionicons name="document-text" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
