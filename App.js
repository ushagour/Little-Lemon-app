import * as React from 'react';

import SplashScreen from './screens/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useFonts } from './hooks/useFonts';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';


export default function App() {
  const { fontsLoaded } = useFonts();

  if (!fontsLoaded) {
    // Show splash while loading fonts
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <SplashScreen />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View  style={{ flex: 1 }}>
        <StatusBar style="light" />
        <AuthProvider>
          <CartProvider>
            <SQLiteProvider databaseName="little_lemon.db">
              <AppNavigator />
            </SQLiteProvider>
          </CartProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}
