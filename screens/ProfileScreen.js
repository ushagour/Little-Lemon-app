import React from 'react';
import { View, Text, StyleSheet, Pressable,Image,TouchableOpacity } from 'react-native';
import colors from '../config/colors';

const ProfileScreen = ({ route, navigation }) => {
  const { firstName = '', email = '' } = route?.params || {};

  const hasData = Boolean(firstName || email);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
            <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text  style={styles.backButtonText}>back</Text>
      </TouchableOpacity>

        <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />


      <TouchableOpacity>
        <Image
          source={require('../assets/images/Profile.png')}   
          style={styles.profileIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      </View>

   <View style={styles.ProfileWrapper}>   
          <Text style={styles.ProfileWrapperTitle}>Personal Information</Text>
          <Text style={styles.titleSmall}>Avatar</Text>
       {hasData ? (
        <>
          <View style={styles.row}>
            <Image
              source={require('../assets/images/Profile.png')}   
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.changeButton}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>




          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{firstName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.noData}>No profile data provided.</Text>
      )}

  
  
   </View>

  

 
      <Pressable
        style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('Onboarding', { firstName, email })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EDEFEE',
    justifyContent: 'flex-start',
  },
     header: {
      height: 64, // compact header height so logo has minimal surrounding space
      backgroundColor: '#EDEFEE',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      marginBottom: 20,
      padding: 0,
    },
      backButton: {
 
    backgroundColor: colors.primary1,
    borderRadius: 4,
    padding: 10,
  },
  backButtonText: {
    color: colors.white,
    fontWeight: '600',    
  },
  profileIcon: {
    width: 40,
    height: 40, 
        borderRadius: 20,
  }, 
  logo: { 
    width: 150,
    height: 50,

  },
  ProfileWrapper: {
    marginTop: 20,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // elevation for Android
    elevation: 4,
    marginHorizontal: 4,
  },
  ProfileWrapperTitle: {
    fontSize: 24,
    fontStyle:'bold',
    fontWeight: '600',
    marginBottom: 12,
    color: colors.textPrimary,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    marginRight: 12,
  },
  changeButton: {
    backgroundColor: colors.primary1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  changeButtonText: {
    color: colors.white,
  },
  removeButton: {
    backgroundColor: colors.danger,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  removeButtonText: {
    color: colors.black,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  titleSmall: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontWeight: '600',
    width: 90,
    color: '#333',
    fontSize: 16,
  },
  value: {
    color: '#333',
    fontSize: 16,
  },
  noData: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 24,
    backgroundColor: '#2E86AB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },


});
