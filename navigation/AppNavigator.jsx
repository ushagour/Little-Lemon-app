import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen from '../screens/OnboardingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/Home';

const Stack = createStackNavigator();

export default function AppNavigator({ isOnboardingCompleted, onCompleteOnboarding }) {
  // If onboarding not completed, start with Onboarding, otherwise Home
  const initialRoute = isOnboardingCompleted ? 'Home' : 'Onboarding';

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={initialRoute} 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen 
              {...props} 
              onComplete={onCompleteOnboarding} 
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
