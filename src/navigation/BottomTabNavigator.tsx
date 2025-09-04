import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { MainTabParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { useLanguage } from '../contexts/LanguageContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom tab bar icon component
const TabIcon: React.FC<{ name: string; focused: boolean }> = ({ name, focused }) => {
  const getIcon = () => {
    switch (name) {
      case 'Home':
        return '🏠';
      // return '🏋️‍♂️';
      case 'Profile':
        return '👤';
      case 'About':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={styles.icon}>{getIcon()}</Text>
    </View>
  );
};

export const BottomTabNavigator: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#e96315',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTintColor: '#ffffff',
        headerTitleStyle: styles.headerTitle,
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t.homeTab,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t.profileTab,
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: t.aboutTab,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#3c3c3c',
    borderTopColor: '#e96315',
    borderTopWidth: 1,
    height: 80,
    paddingBottom: 12,
    paddingTop: 12,
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  header: {
    backgroundColor: '#3c3c3c',
    borderBottomColor: '#e96315',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  icon: {
    fontSize: 28,
  },
});
