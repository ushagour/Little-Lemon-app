import React from 'react';
import { Image, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import AppButton from './Forms/AppButton';
import colors from '../config/colors';
import { useAuth } from '../hooks/useAuth';
import Avatar from './ui/Avatar';

/**
 * Header with three columns: left button, centered logo, right profile/content.
 * Props:
 * - onLeftPress: function called when left button is pressed
 * - leftLabel: optional text for left button (default: '‹')
 * - rightContent: optional React node to render on the right (e.g. avatar)
 * - onRightPress: handler for right area
 */
const Header = ({ onLeftPress = null, leftContent = null, rightContent = null, onRightPress = null }) => {
  const { isUserOnboarded } = useAuth();

  // Only show avatar/profile button when user has completed onboarding
  const rightNode = rightContent ?? (isUserOnboarded ? <Avatar /> : null);

  return (
    <View style={styles.header}>
      <View style={styles.side}>
   
     {leftContent ? (
          <TouchableOpacity onPress={onLeftPress} style={styles.sideButton}>
            {leftContent}
          </TouchableOpacity>
        ) : (
          <View style={styles.sidePlaceholder} />
        )}
        
      </View>

      <View style={styles.center} pointerEvents="none">
        <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.side}>
        {rightNode ? (
          <TouchableOpacity onPress={onRightPress} style={styles.sideButton} disabled={!onRightPress}>
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
    height: 70,
    backgroundColor: colors.secondary4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 10,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  side: {
    width: 64,
    alignItems: 'flex-start',
    justifyContent: 'center',
  
  },
  sideButton: {
    paddingHorizontal: 8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },


  sideButtonText: {
    color: '#333',
    
  },
  sidePlaceholder: {
    width: 40,
    height: 40,
  },
  pressed: {
    opacity: 0.7,
  },
});