import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/Home';

const Stack = createStackNavigator();

export default function AppNavigator({...props}) {
  const isOnboardingCompleted = props?.isOnboardingCompleted || props?.state?.isOnboardingCompleted || false;
  const initialRoute = isOnboardingCompleted ? 'Home' : 'Onboarding';

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {/* register all screens so navigation.navigate('Profile') always works */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
