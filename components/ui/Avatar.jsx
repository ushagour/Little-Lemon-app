import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import colors from '../../config/colors';
import { useAuth } from '../../hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';

const Avatar = ({ size = 50 }) => {
  const { user } = useAuth();
  
  // Generate initials from firstName and lastName
  const initials = `${(user?.firstName?.[0] || '').toUpperCase()}${(user?.lastName?.[0] || '').toUpperCase()}`;
  
  // Determine which avatar to render
  const renderAvatar = () => {
    // Condition 1: User has avatar image
    if (user?.avatar) {
      return (
        <Image
          source={{ uri: user.avatar }}
          style={{ 
            width: size, 
            height: size, 
            borderRadius: size / 2 
          }}
        />
      );
    }
    
    // Condition 2: User has initials (firstName and/or lastName)
    if (initials.length > 0) {
      return (
        <View style={[styles.InitialsWrapper, { 
          width: size, 
          height: size, 
          borderRadius: size / 2 
        }]}>
          <Text style={[styles.InitialsText, { fontSize: size * 0.56 }]}>
            {initials}
          </Text>
        </View>
      );
    }
    
    // Condition 3: No user data available - show default icon
    return (
      <Ionicons 
        name="person-circle-outline" 
        size={size} 
        color={colors.primary1} 
      />
    );
  };

  return <View>{renderAvatar()}</View>;
}

export default Avatar;

const styles = StyleSheet.create({
  InitialsWrapper: {
    backgroundColor: colors.primary3,
    alignItems: 'center',
    justifyContent: 'center',
  },

  InitialsText: {
    color: colors.primary1,
    fontWeight: '700',
  },
});



