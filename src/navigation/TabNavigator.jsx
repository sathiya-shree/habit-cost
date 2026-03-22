// src/navigation/TabNavigator.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SHADOW } from '../utils/theme';
import DashboardScreen from '../screens/DashboardScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Dashboard', label: 'Home',      icon: '🏠', activeIcon: '🏡' },
  { name: 'Analytics',  label: 'Analytics', icon: '📊', activeIcon: '📈' },
  { name: 'Profile',    label: 'Profile',   icon: '👤', activeIcon: '🙋' },
];

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.tabBarOuter}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const focused = state.index === index;
          const tab = TABS[index];

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.8}
            >
              {focused ? (
                <LinearGradient colors={COLORS.gradHero} style={styles.activeTab} start={{x:0,y:0}} end={{x:1,y:1}}>
                  <Text style={styles.activeIcon}>{tab.activeIcon}</Text>
                  <Text style={styles.activeLabel}>{tab.label}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.inactiveTab}>
                  <Text style={styles.inactiveIcon}>{tab.icon}</Text>
                  <Text style={styles.inactiveLabel}>{tab.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Analytics"  component={AnalyticsScreen} />
      <Tab.Screen name="Profile"    component={ProfileScreen}   />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 16,
    ...SHADOW.sm,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
  },
  tabItem: { flex: 1 },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  activeIcon: { fontSize: 18 },
  activeLabel: { fontFamily: FONTS.semibold, fontSize: 13, color: '#fff' },
  inactiveTab: {
    alignItems: 'center',
    paddingVertical: 10,
    gap: 3,
  },
  inactiveIcon: { fontSize: 22 },
  inactiveLabel: { fontFamily: FONTS.regular, fontSize: 11, color: COLORS.text3 },
});
