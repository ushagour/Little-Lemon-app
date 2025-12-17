import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const PROFILE_KEY = '@littlelemon_profile';
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user profile from AsyncStorage on mount
  useEffect(() => {
 

    loadUser();
  }, []);



     const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem(PROFILE_KEY);

        
        if (json) {
          const data = JSON.parse(json);
          setUser(data);
        }
      } catch (e) {
        console.log('Error loading user from storage:', e);
      } finally {
        setIsLoading(false);
      }
    };

    
  // Update user profile in AsyncStorage and state
  const updateUser = async (userData) => {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (e) {
      console.log('Error saving user to storage:', e);
      return false;
    }
  };

  // Complete onboarding: merge provided profile data and set isUserOnboarded=true
  const completeOnboarding = async (profileData) => {
    try {
      const nextUser = {
        ...(user || {}),
        ...(profileData || {}),
        isUserOnboarded: true,
      };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
      return true;
    } catch (e) {
      console.log('Error completing onboarding:', e);
      return false;
    }
  };

  // Clear user (logout)
  const logout = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_KEY);
      setUser(null);
      return true;
    } catch (e) {
      console.log('Error clearing user:', e);
      return false;
    }
  };



  const value = {
    user,
    isLoading,
    updateUser,
    completeOnboarding,
    isUserOnboarded: Boolean(user?.isUserOnboarded),
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
