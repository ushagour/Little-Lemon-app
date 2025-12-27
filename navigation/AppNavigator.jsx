import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/Home';
import DetailScreen from '../screens/DetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import { useAuth } from '../hooks/useAuth';
import ChangePassword from '../screens/Auth/ChangePassword';

const Stack = createStackNavigator();

// Auth Navigator - handles authentication related screens
function AuthNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Onboarding" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

    </Stack.Navigator>
  );
}

// Main App Navigator - handles main application screens
function MainNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Home" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Details" component={DetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { isUserOnboarded, isLoading } = useAuth();

  // While auth state is loading from storage, show splash to avoid flashing wrong route
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isUserOnboarded ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
