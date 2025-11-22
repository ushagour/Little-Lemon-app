import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import TextInput from '../components/Forms/TextInput';
import AppButton from '../components/Forms/AppButton';
import colors from '../config/colors';
import AppCheckbox from '../components/Forms/AppCheckbox';
import { MaskedTextInput } from "react-native-mask-text";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProfileScreen = ({ route, navigation }) => {
  const PROFILE_KEY = '@littlelemon_profile';
  const { firstName = '', email = '' } = route?.params || {};

  // allow editing in-place
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [familyName, setFamilyName] = useState(route?.params?.familyName || '');
  const [editEmail, setEditEmail] = useState(email);
  // phoneMasked holds the formatted string shown in the input (e.g. +1 (555) 555-5555)
  // phoneRaw holds digits only (e.g. 5555555555)
  const [phoneMasked, setPhoneMasked] = useState(route?.params?.phone || '');
  const [phoneRaw, setPhoneRaw] = useState((route?.params?.phone || '').replace(/\D/g, ''));

  useEffect(() => {
    // if route params change externally, update local state
    setEditFirstName(firstName);
    setEditEmail(email);
    setFamilyName(route?.params?.familyName || '');
    setPhoneMasked(route?.params?.phone || '');
    setPhoneRaw((route?.params?.phone || '').replace(/\D/g, ''));
  }, [route?.params]);

  // load saved profile from AsyncStorage on mount (session)
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const json = await AsyncStorage.getItem(PROFILE_KEY);
        if (json) {
          const data = JSON.parse(json);
          if (data.firstName) setEditFirstName(data.firstName);
          if (data.familyName) setFamilyName(data.familyName);
          if (data.email) setEditEmail(data.email);
          if (data.phone) {
            setPhoneMasked(data.phone);
            setPhoneRaw((data.phone || '').replace(/\D/g, ''));
          }
          if (typeof data.prefOrderStatus === 'boolean') setPrefOrderStatus(data.prefOrderStatus);
          if (typeof data.prefPasswordChanges === 'boolean') setPrefPasswordChanges(data.prefPasswordChanges);
          if (typeof data.prefSpecialOffers === 'boolean') setPrefSpecialOffers(data.prefSpecialOffers);
          if (typeof data.prefNewsletter === 'boolean') setPrefNewsletter(data.prefNewsletter);
        }
      } catch (e) {
        console.log('Failed to load profile from storage', e);
      }
    };
    loadProfile();
  }, []);

  const phoneIsValid = phoneRaw.length === 10;

  // derive avatar URI (if uploaded) and initials fallback
  const avatarUri = route?.params?.avatar || route?.params?.photo || null;
  const initials = `${(editFirstName?.[0] || '').toUpperCase()}${(familyName?.[0] || '').toUpperCase()}`;

  // preference checkboxes
  const [prefOrderStatus, setPrefOrderStatus] = useState(false);
  const [prefPasswordChanges, setPrefPasswordChanges] = useState(false);
  const [prefSpecialOffers, setPrefSpecialOffers] = useState(false);
  const [prefNewsletter, setPrefNewsletter] = useState(false);





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

        <Image source={avatarUri? avatarUri : initials} style={styles.logo} resizeMode="contain" />



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
          <View style={styles.row}>
            {avatarUri ? (
              <Image
                source={typeof avatarUri === 'string' ? { uri: avatarUri } : avatarUri}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitials}>{initials || 'NN'}</Text>
              </View>
            )}
          <View style={styles.avatarButtons}>
            <AppButton
              title=""
              onPress={() => { /* TODO: open image picker */ }}
              color="primary1"
                         buttonStyle={styles.Smbtn}

            />
            <AppButton
              title=""
              onPress={() => { /* TODO: remove avatar */ }}
              color="danger"
                         buttonStyle={styles.Smbtn}

            />
            <AppButton
              title="logout"
              //clear stored profile and navigate to splash
              onPress={() => {
                AsyncStorage.removeItem(PROFILE_KEY)
                  .then(() => {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Splash' }],
                    });
                  })
                  .catch((e) => {
                    console.log('Failed to clear profile from storage', e);
                  });
              }}
              color="secondary2"
                         buttonStyle={styles.Smbtn}

            />
          </View>
          </View>


          {/* Editable inputs (always visible) */}
          <View style={styles.inputContainer}>

         
          <View style={styles.inputRow}>
            <TextInput value={editFirstName} placeholder="First Name" onChangeText={setEditFirstName} styleInput={styles.input} />
          </View>

          <View style={styles.inputRow}>
                    <TextInput value={familyName} placeholder="Family Name" onChangeText={setFamilyName} styleInput={styles.input} />
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

       
       
      

          <AppButton
            title="Save"
            onPress={async () => {
              // Collect profile data and include formatted phone
              const profile = {
                firstName: editFirstName,
                email: editEmail,
                familyName,
                phone: phoneMasked,
                prefOrderStatus,
                prefPasswordChanges,
                prefSpecialOffers,
                prefNewsletter,
              };
              try {
                console.log(profile);
                
                await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
              } catch (e) {
                console.log('Failed to save profile to storage', e);
              }
              // update navigation params so other screens get the latest
              navigation.setParams(profile);
            }}
            color="primary2"
            disabled={!phoneIsValid}
            buttonStyle={styles.saveButton}
          />

 </View>
 </View>
  
  
   </View>
 

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
  avatarButtons: {
  paddingVertical: 6,
      flexDirection: 'row',
      height: 120,
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
    backgroundColor: '#F5F5F5',
    width: '100%',

  },
  checkBoxContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: colors.textPrimary,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BFC9CC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkBoxChecked: {
    backgroundColor: colors.primary1,
    borderColor: colors.primary1,
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 14,
  },
  checkLabel: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: colors.danger,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  saveButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
Smbtn: {
    marginRight: 10,
    paddingVertical: 6, 
    paddingHorizontal: 12,
  borderRadius: 6,
  },


});
