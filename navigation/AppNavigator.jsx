import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/Home';
import { useAuth } from '../hooks/useAuth';


const Stack = createStackNavigator();


export default function AppNavigator() {
  const { isUserOnboarded, isLoading } = useAuth();

  // While auth state is loading from storage, show splash to avoid flashing wrong route
  if (isLoading) {
    return <SplashScreen />;
  }

  // Determine initial route based on whether user completed onboarding
  const initialRoute = isUserOnboarded ? 'Home' : 'Onboarding';

  return (
    <NavigationContainer key={isUserOnboarded ? 'onboarded' : 'guest'}>
      <Stack.Navigator 
        initialRouteName={initialRoute} 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
