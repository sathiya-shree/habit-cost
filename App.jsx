import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import SplashScreenComp from './src/screens/SplashScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import TabNavigator from './src/navigation/TabNavigator';

// This is required — tells the app how to handle notifications when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission immediately on Android 13+
async function registerForNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#0CB8A4',
      });
    }
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (e) {
    console.log('Notification setup error:', e);
    return false;
  }
}

SplashScreen.preventAutoHideAsync().catch(() => {});

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex:1, backgroundColor:'#E8F8F0', alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator size="large" color="#0CB8A4" />
      </View>
    );
  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {user ? (
        <Stack.Screen name="App"      component={TabNavigator} />
      ) : (
        <>
          <Stack.Screen name="Splash"   component={SplashScreenComp} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login"    component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Request notification permissions on startup
        await registerForNotifications();
        await SplashScreen.hideAsync();
      } catch (e) {}
      setReady(true);
    }
    prepare();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex:1, backgroundColor:'#E8F8F0', alignItems:'center', justifyContent:'center' }}>
        <ActivityIndicator size="large" color="#0CB8A4" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
