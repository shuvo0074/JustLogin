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
        return focused ? '🏋️‍♂️' : '🏋️‍♀️';
      case 'Profile':
        return focused ? '💪' : '👤';
      case 'About':
        return focused ? '🏆' : 'ℹ️';
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
          tabBarTestID: 'tab-home',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t.profileTab,
          tabBarTestID: 'tab-profile',
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: t.aboutTab,
          tabBarTestID: 'tab-about',
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
    // height: 60,
    // paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
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
  },
  icon: {
    fontSize: 20,
  },
});
