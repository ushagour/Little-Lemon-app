import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Platform, ToastAndroid,TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppButton from '../components/Forms/AppButton';
import colors from '../config/colors';
import AppCheckbox from '../components/Forms/AppCheckbox';
import { MaskedTextInput } from "react-native-mask-text";
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';


const ProfileScreen = ({ route, navigation }) => {
  const { user, updateUser, clearUser } = useAuth();

  // Initialize with empty strings, will load from AsyncStorage
  const [editFirstName, setEditFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  // phoneMasked holds the formatted string shown in the input (e.g. +1 (555) 555-5555)
  // phoneRaw holds digits only (e.g. 5555555555)
  const [phoneMasked, setPhoneMasked] = useState('');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);



  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', message);
    }
  };



  // Load profile when user data changes from context
  useEffect(() => {
    loadProfile();
  }, [user]);



  const Discard = () => {
    // reset edits to last saved state
    loadProfile();
  };

  // Pick image from gallery
  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setAvatarUri(selectedImage);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Remove avatar
  const removeAvatar = () => {
    Alert.alert(
      'Remove Avatar',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => setAvatarUri(null)
        }
      ]
    );
  };









  const save = async () => {
              // Collect profile data and include formatted phone
              const profile = {
                firstName: editFirstName,
                email: editEmail,
                lastName: lastName,
                phone: phoneMasked,
                avatar: avatarUri,
                prefOrderStatus,
                prefPasswordChanges,
                prefSpecialOffers,
                prefNewsletter,
                isAuthenticated: true,
              };
              
              const success = await updateUser(profile);
              if (success) {
                showToast('Profile updated successfully');
              } else {
                Alert.alert('Error', 'Unable to save your profile. Please try again.');
              }
              // update navigation params so other screens get the latest
              navigation.setParams(profile);
            }
 
  const Logout = async () => {
                const success = await clearUser();
                if (success) {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Onboarding' }],
                  });
                } else {
                  Alert.alert('Error', 'Failed to logout. Please try again.');
                }
              }

  const phoneIsValid = phoneRaw.length === 10;

  // derive initials fallback
  const initials = `${(editFirstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;

  // preference checkboxes
  const [prefOrderStatus, setPrefOrderStatus] = useState(false);
  const [prefPasswordChanges, setPrefPasswordChanges] = useState(false);
  const [prefSpecialOffers, setPrefSpecialOffers] = useState(false);
  const [prefNewsletter, setPrefNewsletter] = useState(false);

  // Load profile from AsyncStorage
  const loadProfile = () => {
    if (user) {
      if (user.firstName) setEditFirstName(user.firstName);
      if (user.lastName) setLastName(user.lastName);
      if (user.email) setEditEmail(user.email);
      if (user.avatar) setAvatarUri(user.avatar);
      if (user.phone) {
        setPhoneMasked(user.phone);
        setPhoneRaw((user.phone || '').replace(/\D/g, ''));
      }
      if (typeof user.prefOrderStatus === 'boolean') setPrefOrderStatus(user.prefOrderStatus);
      if (typeof user.prefPasswordChanges === 'boolean') setPrefPasswordChanges(user.prefPasswordChanges);
      if (typeof user.prefSpecialOffers === 'boolean') setPrefSpecialOffers(user.prefSpecialOffers);
      if (typeof user.prefNewsletter === 'boolean') setPrefNewsletter(user.prefNewsletter);
    }
  };

  // Call loadProfile once on mount




  const hasData = Boolean(editFirstName || editEmail);

  return (
    <View style={styles.container}>
      <Header 
      

      leftContent={
            <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
      <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      }
      
      
      
      
      />


  <View style={styles.ProfileWrapper}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.ProfileWrapperTitle}>Personal Information</Text>
          <Text style={styles.titleSmall}>Avatar</Text>
          <View style={styles.row}>
            {avatarUri ? (
              <Image
                source={typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials || ''}</Text>
              </View>
            )}
          <View style={styles.avatarButtons}>
            <AppButton
              title="change"
              onPress={pickImage}
              color="primary1"
              buttonStyle={[styles.saveButton, { marginRight: 10, borderColor: colors.primary1, borderWidth: 1 }]}
              textStyle={[styles.TextButtons, { color: colors.white }]}

            />
            <AppButton
              title="remove"
              onPress={removeAvatar}
              color="white"
              buttonStyle={styles.discardButton}
              textStyle={{...styles.TextButtons, color: colors.primary1}}

            />
      
          </View>
          </View>


          {/* Editable inputs (always visible) */}
          <View style={styles.inputContainer}>

         
          <View style={styles.inputRow}>
            <TextInput value={editFirstName} placeholder="First Name" onChangeText={setEditFirstName} style={styles.input} />
          </View>

          <View style={styles.inputRow}>
                    <TextInput value={lastName} placeholder="Last Name" onChangeText={setLastName} style={styles.input} />
          </View>

          <View style={styles.inputRow}>
            <TextInput value={editEmail} placeholder="Email" onChangeText={setEditEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          </View>

          <View style={styles.inputRow}>

            <MaskedTextInput
              mask="+1 (999) 999-9999"
              onChangeText={(masked, raw) => {
                setPhoneMasked(masked);
                // raw is digits only (react-native-mask-text)
                setPhoneRaw(raw);

              }}
              placeholder="+1 (999) 999-9999"
              style={[styles.input, {  paddingVertical: 8, borderWidth: 1, borderColor: colors.primary1, backgroundColor: '#F5F5F5', paddingHorizontal: 12 }]}
              keyboardType="phone-pad"
              value={phoneMasked}
            />
          </View>

          {!phoneIsValid && phoneRaw.length > 0 ? (
            <Text style={styles.errorText}>Enter a valid US phone number (10 digits).</Text>
          ) : null}

          {!hasData && <Text style={styles.noData}>No profile data provided.</Text>}

            </View>
{/* //design for checkbox like figma */}

<View style={styles.checkBoxContainer}>

         <Text style={styles.sectionTitle}>Email notifications</Text>
       
<AppCheckbox
  checked={prefOrderStatus}
  onChange={setPrefOrderStatus}
  style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
  label="Order status changes"
/>
<AppCheckbox
  checked={prefPasswordChanges}
  onChange={setPrefPasswordChanges}
  style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
  label="Password changes"
/>
<AppCheckbox
  checked={prefSpecialOffers}
  onChange={setPrefSpecialOffers}
  style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
  label="Special offers"
/>
<AppCheckbox
  checked={prefNewsletter}
  onChange={setPrefNewsletter}
  style={{ tintColors: { true: colors.primary1} }}
  label="Newsletter"
/>

       
       
      

        

           

 </View>
   <AppButton
              title="logout"
              //clear stored profile and navigate to splash
              onPress={Logout}
              color="primary2"
             buttonStyle={styles.LogoutButton}
             textStyle={styles.TextButtons}

            />
          <View style={styles.footerWrapper}>
            <AppButton
              title="Discard Changes"
              onPress={Discard}
              color="white"
              disabled={!phoneIsValid}
              buttonStyle={[styles.saveButton, { marginRight: 10, borderColor: colors.primary1, borderWidth: 1 }]}
            />
            <AppButton
              title="Save Changes"
              onPress={save}
              color="primary1"
              disabled={!phoneIsValid}
              textStyle={[styles.TextButtons, { color: colors.white }]}
            />
          </View>

    </ScrollView>
    </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
    justifyContent: 'flex-start',
  },
   backButton: {
        
    backgroundColor: colors.primary1,
    borderRadius: 4,
  },
 
 avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9EAF6',
  },
  avatarInitials: {
    color: colors.primary1,
    fontSize: 28,
    fontWeight: '700',
  },

  ProfileWrapperTitle: {
    fontSize: 28,
    fontStyle:'bold',
    fontWeight: '600',
    fontFamily: 'Karla-Bold',
    color: colors.textPrimary,
  },
    title: {
    fontSize: 28,
    fontFamily: 'Karla-Bold',
    fontWeight: '700',
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9EAF6',
  },
  ProfileWrapper: {
    flex: 2,
    width: '100%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // elevation for Android
    // elevation: 4,
    // marginBottom: 20,
  },
  titleSmall: {
    fontSize: 12,
    color: colors.primary1,
    fontFamily:'bold'

  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 6,
  },
  avatarButtons: {
      paddingVertical: 6,
      flexDirection: 'row',
      height: 120,
      alignItems: 'center',
      justifyContent: 'space-between',  

  },

  inputContainer: {
    alignItems: 'center',
  },  
  label: {
    fontWeight: '600',
    width: 90,
    color: '#333',
    fontSize: 16,
  },
 
  noData: {
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,


  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 6,
    height: 40, 
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.primary1,
    paddingHorizontal: 12,
    width: '100%',

  },
  checkBoxContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '600',
      fontFamily: 'MarkaziText-Medium',

    color: colors.textPrimary,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  checkMark: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14,
  },
  checkLabel: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'MarkaziText-Medium',
    color: '#333',
  },
  errorText: {
    color: colors.danger,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  LogoutButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    width: '100%',//full width
    justifyContent: 'center',
    alignItems: 'center', 
  },
  saveButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  discardButton: {
    borderColor: colors.primary1,
    borderWidth: 1,
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  TextButtons: {
    fontStyle:'bold',
    fontWeight: '600',


  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },  





});
