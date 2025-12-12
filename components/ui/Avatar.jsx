import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native';
import colors from '../../config/colors';


const Avatar = ({avatarUri,initials}) => {
  return (
    <>
        { avatarUri ? (
                    <Image
                      source={typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri}
                    style={styles.profileIcon}
                    resizeMode="contain" 
                    />
                  ) : (
                    <View style={styles.InitialsWrapper}>
                      <Text style={styles.InitialsText}>{initials || 'NN'}</Text>
                    </View>
                  )}
                  </>
  )
}

export default Avatar

const styles = StyleSheet.create({


  InitialsWrapper: {
    width: 50,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#D9EAF6',
    alignItems: 'center',
    justifyContent: 'center',

  },

 InitialsText: {
    color: colors.primary1,
    fontSize: 28,
    fontWeight: '700',
  },









})