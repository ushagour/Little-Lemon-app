import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../config/colors';
import { useAuth } from '../hooks/useAuth';
import Avatar from './ui/Avatar';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

/**
 * Enhanced Header with responsive design for different device types.
 * Features:
 * - Dynamic safe area handling for notches and status bars
 * - Responsive sizing for phones, tablets, and different orientations
 * - Three-column layout: left action, centered logo, right content
 * - Accessibility support
 * 
 * Props:
 * - onLeftPress: function called when left button is pressed
 * - leftContent: optional React node for left side (e.g., back button)
 * - rightContent: optional React node for right side (overrides default avatar)
 * - onRightPress: handler for right area tap
 */
const Header = ({ 
  onLeftPress = null, 
  leftContent = null, 
  rightContent = null, 
  onRightPress = null 
}) => {
  const { isUserOnboarded } = useAuth();
  const insets = useSafeAreaInsets();

  // Only show avatar/profile button when user has completed onboarding
  const rightNode = rightContent ?? (isUserOnboarded ? <Avatar /> : null);

  // Dynamic header height based on device and safe area
  const headerHeight = Platform.select({
    ios: 70 + insets.top,
    android: 70,
    default: 70,
  });

  return (
    <View 
      style={[
        styles.header, 
        { 
          height: headerHeight,
          paddingTop: Platform.OS === 'ios' ? insets.top : 0,
        }
      ]}
      testID="app-header"
    >
      <View style={styles.side}>
        {leftContent ? (
          <TouchableOpacity 
            onPress={onLeftPress} 
            style={styles.sideButton}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Navigate back"
            testID="header-left-button"
          >
            {leftContent}
          </TouchableOpacity>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
      </View>

      <View style={styles.center} pointerEvents="none">
        <Image 
          source={require('../assets/images/Logo.png')} 
          style={styles.logo} 
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="Little Lemon logo"
        />
      </View>

      <View style={styles.side}>
        {rightNode ? (
          <TouchableOpacity 
            onPress={onRightPress} 
            style={styles.sideButton} 
            disabled={!onRightPress}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Profile menu"
            testID="header-right-button"
          >
            {rightNode}
          </TouchableOpacity>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isTablet ? 24 : 12,
    paddingBottom: 8,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation for Android
    elevation: 4,
    zIndex: 100,
  },
  side: {
    minWidth: isTablet ? 80 : 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButton: {
    padding: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  logo: {
    width: isTablet ? 220 : 180,
    height: isTablet ? 50 : 40,
  },
  sidePlaceholder: {
    width: 44,
    height: 44,
  },
});