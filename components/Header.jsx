import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import AppButton from './Forms/AppButton';

/**
 * Header with three columns: left button, centered logo, right profile/content.
 * Props:
 * - onLeftPress: function called when left button is pressed
 * - leftLabel: optional text for left button (default: '‹')
 * - rightContent: optional React node to render on the right (e.g. avatar)
 * - onRightPress: handler for right area
 */
const Header = ({ onLeftPress = null, leftLabel = '', rightContent = null, onRightPress = null }) => {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onLeftPress ? (
          <AppButton
            title={leftLabel}
            onPress={onLeftPress}
            buttonStyle={styles.sideButton}
            textStyle={styles.sideButtonText}
          />
        ) : (
          // keep space so center stays centered
          <View style={styles.sidePlaceholder} />
        )}
      </View>

      <View style={styles.center} pointerEvents="none">
        <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.side}>
        {rightContent ? (
          <AppButton onPress={onRightPress} buttonStyle={styles.sideButton}>
            {rightContent}
          </AppButton>
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
    height: 80,
    backgroundColor: '#EDEFEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  side: {
    width: 64,
    alignItems: 'flex-start',
    justifyContent: 'center',
  
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 50,
  },
  sideButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'transparent',
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