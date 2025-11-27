import * as React from 'react';

import SplashScreen from './screens/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isOnboardingCompleted, setIsOnboardingCompleted] = React.useState(false);

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

  if (isLoading) {
    // Show splash while reading from AsyncStorage
    return <SplashScreen />;
  }

  return (
    <AppNavigator
      isOnboardingCompleted={isOnboardingCompleted}
      onCompleteOnboarding={completeOnboarding}
      state={true}
    />
  );
}

