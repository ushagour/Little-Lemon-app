import * as React from 'react';

import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';
import { SQLiteProvider } from 'expo-sqlite';
import {
  SafeAreaView,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { useFonts } from './hooks/useFonts';
import { AuthProvider } from './context/AuthContext';


export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = React.useState(false);
  const { fontsLoaded, fontError } = useFonts();


  // Load onboarding state from AsyncStorage
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const completed = await AsyncStorage.getItem('onboardingCompleted');
        setIsOnboardingCompleted(completed === 'true');
      } catch (e) {
        console.log('Error reading onboarding data:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Simulate saving onboarding completion
  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'true');
    setIsOnboardingCompleted(true);
  };

  if (isLoading || !fontsLoaded) {
    // Show splash while reading from AsyncStorage or loading fonts
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <SplashScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <AuthProvider>
          <SQLiteProvider
            databaseName="little_lemon.db"
            // useSuspense={false}
          >
            <AppNavigator
              isOnboardingCompleted={isOnboardingCompleted}
              onCompleteOnboarding={completeOnboarding}
            />
          </SQLiteProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
