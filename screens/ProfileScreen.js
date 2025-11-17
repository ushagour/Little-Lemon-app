import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import TextInput from '../components/Forms/TextInput';
import AppButton from '../components/Forms/AppButton';
import colors from '../config/colors';
import AppCheckbox from '../components/Forms/AppCheckbox';

const ProfileScreen = ({ route, navigation }) => {
  const { firstName = '', email = '' } = route?.params || {};

  // allow editing in-place
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [familyName, setFamilyName] = useState(route?.params?.familyName || '');
  const [editEmail, setEditEmail] = useState(email);
  const [phone, setPhone] = useState(route?.params?.phone || '');

  useEffect(() => {
    // if route params change externally, update local state
    setEditFirstName(firstName);
    setEditEmail(email);
    setFamilyName(route?.params?.familyName || '');
    setPhone(route?.params?.phone || '');
  }, [route?.params]);

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
            <TextInput value={phone} placeholder="Phone" onChangeText={setPhone} styleInput={styles.input} keyboardType="phone-pad" />
          </View>
          {!hasData && <Text style={styles.noData}>No profile data provided.</Text>}

{/* //design for checkbox like figma */}

<View style={styles.checkBoxContainer}>

         <Text style={styles.sectionTitle}>Email notifications</Text>
       
<AppCheckbox
  checked={prefOrderStatus}
  onChange={setPrefOrderStatus}
  style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
  text="Order status changes"
/>
<AppCheckbox
  checked={prefPasswordChanges}
  onChange={setPrefPasswordChanges}
  style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
  text="Password changes"
/>
<AppCheckbox
  checked={prefSpecialOffers}
  onChange={setPrefSpecialOffers}
  style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
  text="special offers"
/>
<AppCheckbox
  checked={prefNewsletter}
  onChange={setPrefNewsletter}
  style={{ tintColors: { true: colors.primary1} }}
  text="Newsletter"
/>

       
       
      

          <AppButton


          buttonStyle={styles.logoutBTN}
          title="Logout"
          onPress={() => console.log('logout')}
          color="primary2"

          />

 </View>
 </View>
  
  
   </View>
 
      <AppButton
        title="Save"
        onPress={() => {
          navigation.setParams({
            firstName: editFirstName,
            email: editEmail,
            familyName,
            phone,
            prefOrderStatus,
            prefPasswordChanges,
            prefSpecialOffers,
            prefNewsletter,
          });
        }}
        buttonStyle={styles.editButton}
        textStyle={styles.editButtonText}
      />
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
  inputContainer: {
    marginTop: 8,
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
  },
  logoutBTN: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary2,
    borderRadius: 6,
    height: 40, 
    paddingVertical: 8,
        paddingHorizontal: 12,

    justifyContent: "center",

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
