import * as Font from 'expo-font';
import { useState, useEffect } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontError, setFontError] = useState(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Add your fonts here with custom names
        await Font.loadAsync({
          'Karla': require('../assets/fonts/Karla-Regular.ttf'),
          // 'Karla-Bold': require('../assets/fonts/Karla-Bold.ttf'),
          'MarkaziText': require('../assets/fonts/MarkaziText-Regular.ttf'),
          // 'MarkaziText-Bold': require('../assets/fonts/MarkaziText-Bold.ttf'),
          // Add more fonts as needed
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontError(error);
      }
    };

    loadFonts();
  }, []);

  return { fontsLoaded, fontError };
};
