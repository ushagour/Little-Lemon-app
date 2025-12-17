import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Platform, ToastAndroid, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppButton from '../components/Forms/AppButton';
import colors from '../config/colors';
import AppCheckbox from '../components/Forms/AppCheckbox';
import { MaskedTextInput } from 'react-native-mask-text';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';

const ProfileScreen = ({ navigation }) => {
  const { user, updateUser, logout } = useAuth();

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: null,
    prefOrderStatus: false,
    prefPasswordChanges: false,
    prefSpecialOffers: false,
    prefNewsletter: false,
  });

  const showToast = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notice', message);
    }
  };

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || null,
        prefOrderStatus: Boolean(user.prefOrderStatus),
        prefPasswordChanges: Boolean(user.prefPasswordChanges),
        prefSpecialOffers: Boolean(user.prefSpecialOffers),
        prefNewsletter: Boolean(user.prefNewsletter),
      });
    }
  }, [user]);

  const Discard = () => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || null,
        prefOrderStatus: Boolean(user.prefOrderStatus),
        prefPasswordChanges: Boolean(user.prefPasswordChanges),
        prefSpecialOffers: Boolean(user.prefSpecialOffers),
        prefNewsletter: Boolean(user.prefNewsletter),
      });
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0].uri;
        setProfile((p) => ({ ...p, avatar: selectedImage }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeAvatar = () => {
    Alert.alert('Remove Avatar', 'Remove your profile picture?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => setProfile((p) => ({ ...p, avatar: null })) },
    ]);
  };

  const phoneRaw = (profile.phone || '').replace(/\D/g, '');
  const phoneIsValid = phoneRaw.length === 10;
  const initials = `${(profile.firstName?.[0] || '').toUpperCase()}${(profile.lastName?.[0] || '').toUpperCase()}`;
  const hasData = Boolean(profile.firstName || profile.email);

  const save = async () => {
    const toSave = { ...profile, isUserOnboarded: user?.isUserOnboarded === true };
    const success = await updateUser(toSave);
    if (success) {
      showToast('Profile updated successfully');
      navigation.setParams(toSave);
    } else {
      Alert.alert('Error', 'Unable to save your profile. Please try again.');
    }
  };

  const handelLogout = async () => {
    const success = await logout();
    if (success) {
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    } else {
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        leftContent={
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />

      <View style={styles.ProfileWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.ProfileWrapperTitle}>Personal Information</Text>
          <Text style={styles.titleSmall}>Avatar</Text>
          <View style={styles.row}>
            {profile.avatar ? (
              <Image source={typeof profile.avatar === 'string' ? { uri: profile.avatar } : profile.avatar} style={styles.avatar} />
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
                textStyle={{ ...styles.TextButtons, color: colors.primary1 }}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <TextInput
                value={profile.firstName}
                placeholder="First Name"
                onChangeText={(t) => setProfile((p) => ({ ...p, firstName: t }))}
                style={styles.input}
              />
            </View>
            <View style={styles.inputRow}>
              <TextInput
                value={profile.lastName}
                placeholder="Last Name"
                onChangeText={(t) => setProfile((p) => ({ ...p, lastName: t }))}
                style={styles.input}
              />
            </View>
            <View style={styles.inputRow}>
              <TextInput
                value={profile.email}
                placeholder="Email"
                onChangeText={(t) => setProfile((p) => ({ ...p, email: t }))}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputRow}>
              <MaskedTextInput
                mask="+1 (999) 999-9999"
                onChangeText={(masked) => setProfile((p) => ({ ...p, phone: masked }))}
                placeholder="+1 (999) 999-9999"
                style={[styles.input, { paddingVertical: 8, borderWidth: 1, borderColor: colors.primary1, backgroundColor: '#F5F5F5', paddingHorizontal: 12 }]}
                keyboardType="phone-pad"
                value={profile.phone}
              />
            </View>

            {!phoneIsValid && phoneRaw.length > 0 ? <Text style={styles.errorText}>Enter a valid US phone number (10 digits).</Text> : null}
            {!hasData && <Text style={styles.noData}>No profile data provided.</Text>}
          </View>

          <View style={styles.checkBoxContainer}>
            <Text style={styles.sectionTitle}>Email notifications</Text>
            <AppCheckbox
              checked={profile.prefOrderStatus}
              onChange={(val) => setProfile((p) => ({ ...p, prefOrderStatus: val }))}
              style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
              label="Order status changes"
            />
            <AppCheckbox
              checked={profile.prefPasswordChanges}
              onChange={(val) => setProfile((p) => ({ ...p, prefPasswordChanges: val }))}
              style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
              label="Password changes"
            />
            <AppCheckbox
              checked={profile.prefSpecialOffers}
              onChange={(val) => setProfile((p) => ({ ...p, prefSpecialOffers: val }))}
              style={{ tintColors: { true: colors.primary1, false: '#BFC9CC' } }}
              label="Special offers"
            />
            <AppCheckbox
              checked={profile.prefNewsletter}
              onChange={(val) => setProfile((p) => ({ ...p, prefNewsletter: val }))}
              style={{ tintColors: { true: colors.primary1 } }}
              label="Newsletter"
            />
          </View>

          <AppButton title="logout" onPress={handelLogout} color="primary2" buttonStyle={styles.LogoutButton} textStyle={styles.TextButtons} />

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
    fontWeight: '700',
    fontFamily: 'MarkaziText-Medium',
    color: colors.textPrimary,
  },
  title: {
    fontSize: 28,
    fontFamily: 'MarkaziText-Medium',
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
  ProfileWrapper: {
    flex: 2,
    width: '100%',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  titleSmall: {
    fontSize: 12,
    color: colors.primary1,
    fontFamily: 'bold',
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
    width: '100%',
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
    fontStyle: 'bold',
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