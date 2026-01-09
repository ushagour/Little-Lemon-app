import React, { useState, useEffect } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Platform, ToastAndroid, TextInput, LinearGradient } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AppButton from '../components/Forms/AppButton';
import colors from '../config/colors';
import AppCheckbox from '../components/Forms/AppCheckbox';
import { MaskedTextInput } from 'react-native-mask-text';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import IsAuthWrapper from '../components/ui/IsAuthWrapper';
import NotificationCard from '../components/ui/NotificationCard';
import { useSQLiteContext } from 'expo-sqlite';
import { syncMenuDatabase } from '../database/queries';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const ProfileScreen = ({ navigation }) => {
  const { user, updateUser, logout, isGuest } = useAuth();
  const { orders,unreadCount } = useOrders();
  const db = useSQLiteContext();

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
  const phoneIsValid = phoneRaw.length === 12; // +212 (3 digits) + 9 digits for Moroccan number
  const initials = `${(profile.firstName?.[0] || '').toUpperCase()}${(profile.lastName?.[0] || '').toUpperCase()}`;
  const hasData = Boolean(profile.firstName || profile.email);

  // For guest users, show a message requiring registration to complete ordering
  if (isGuest) {
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
            <Text style={styles.ProfileWrapperTitle}>Guest User</Text>
            <IsAuthWrapper navigation={navigation} />
          </ScrollView>
        </View>
      </View>
    );
  }

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
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const success = await logout();
            if (success) {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Onboarding' }],
              });
            } else{
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleInitDB = async () => {
    Alert.alert(
      'Initialize Database',
      'This will sync the database with the latest schema and reload menu data. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sync Now',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!db) {
                Alert.alert('Error', 'Database not available');
                return;
              }

              showToast('Syncing database...');
              
              const result = await syncMenuDatabase(db, getEnvVars.API_URL);
              
              if (result.success) {
                showToast(`Database synced! ${result.count} items loaded.`);
                
                // Navigate back to home to refresh the menu
                setTimeout(() => {
                  navigation.navigate('Home');
                }, 1000);
              } else {
                Alert.alert('Sync Failed', result.error || 'Unknown error occurred');
              }
            } catch (error) {
              console.error('DB Sync Error:', error);
              Alert.alert('Error', 'Failed to sync database: ' + error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        leftContent={
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        }
        rightContent={
          <View style={styles.notificationIconWrapper}>
            <Ionicons name="notifications" size={26} color={colors.primary1} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </View>
        }
      />

      <View style={styles.ProfileWrapper}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Order Notifications Section */}
          {orders.length > 0 && (
         <NotificationCard  />
          )}

          {/* Profile Header Card */}
          <View style={styles.profileHeaderCard}>
            <View style={styles.profileHeaderContent}>
              <Text style={styles.ProfileWrapperTitle}>Personal Information</Text>
              <Text style={styles.subtitleText}>Manage your account details and preferences</Text>
            </View>
          </View>

          {/* Avatar Section Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="account-circle" size={24} color={colors.primary1} />
              <Text style={styles.sectionTitle}>Profile Picture</Text>
            </View>
          <View style={styles.row}>
            {profile.avatar ? (
              <Image source={typeof profile.avatar === 'string' ? { uri: profile.avatar } : profile.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                {initials ?
                
                <Text style={styles.avatarInitials}>{initials}</Text>
                
                :
                <Ionicons name="person-circle" size={80} color={colors.primary1} />
                }
              


                </View>
            )}
            <View style={styles.avatarButtons}>
              <AppButton
                children={<MaterialIcons name="photo-library" size={20} color={colors.white} />}
                onPress={pickImage}
                color="primary1"
              />
              <AppButton
                children={<MaterialIcons name="delete" size={20} color={colors.white} />}
                onPress={removeAvatar}
                color="primary2"
              />
            </View>
          </View>
          </View>

          {/* Personal Details Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person" size={24} color={colors.primary1} />
              <Text style={styles.sectionTitle}>Personal Details</Text>
            </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person-outline" size={20} color={colors.primary1} style={styles.inputIcon} />
                <TextInput
                  value={profile.firstName}
                  placeholder="First Name"
                  onChangeText={(t) => setProfile((p) => ({ ...p, firstName: t }))}
                  style={styles.inputWithIcon}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="badge" size={20} color={colors.primary1} style={styles.inputIcon} />
                <TextInput
                  value={profile.lastName}
                  placeholder="Last Name"
                  onChangeText={(t) => setProfile((p) => ({ ...p, lastName: t }))}
                  style={styles.inputWithIcon}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={20} color={colors.primary1} style={styles.inputIcon} />
                <TextInput
                  value={profile.email}
                  placeholder="Email Address"
                  onChangeText={(t) => setProfile((p) => ({ ...p, email: t }))}
                  style={styles.inputWithIcon}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="phone" size={20} color={colors.primary1} style={styles.inputIcon} />
                <MaskedTextInput
                  mask="+212 [6-9]99 999-9999"
                  onChangeText={(masked) => setProfile((p) => ({ ...p, phone: masked }))}
                  placeholder="+212 600 000-0000"
                  style={styles.inputWithIcon}
                  keyboardType="phone-pad"
                  value={profile.phone}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {!phoneIsValid && phoneRaw.length > 0 ? <Text style={styles.errorText}>⚠️ Enter a valid Moroccan phone number (+212 + 9 digits).</Text> : null}
            {!hasData && <Text style={styles.noData}>No profile data provided.</Text>}
          </View>
          </View>

          {/* Notifications Preferences Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="notifications-active" size={24} color={colors.primary1} />
              <Text style={styles.sectionTitle}>Email Notifications</Text>
            </View>
          <View style={styles.checkBoxContainer}>
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
          </View>

       {/* Save/Discard Footer */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
            <AppButton
              title="Discard"
              onPress={Discard}
              color="white"
              disabled={!phoneIsValid}
              buttonStyle={[styles.saveButton, { marginRight: 10, borderColor: colors.primary1, borderWidth: 1 }]}
            />
            <AppButton
              title="Save"
              onPress={save}
              color="primary1"
              disabled={!phoneIsValid}
              textStyle={[styles.TextButtons, { color: colors.white }]}
              buttonStyle={[styles.saveButton, { marginRight: 10, borderColor: colors.primary1, borderWidth: 1 }]}
            />
          </View>  
          </View>  

          {/* Quick Actions Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="settings" size={24} color={colors.primary1} />
              <Text style={styles.sectionTitle}>Account Actions</Text>
            </View>

          <AppButton 
            title="Logout" 
            onPress={handelLogout} 
            color="primary2" 
            buttonStyle={styles.LogoutButton} 
            textStyle={styles.TextButtons}
            icon={<MaterialIcons name="logout" size={20} color={colors.primary1} style={{ marginRight: 8 }} />}
          />
          
          <AppButton 
            title="Change Password" 
            onPress={() => navigation.navigate('ChangePassword')} 
            color="danger"
            buttonStyle={styles.changePasswordButton} 
            textStyle={[styles.TextButtons, { color: colors.white }]} 
          />

          <AppButton 
            title="Sync Database" 
            onPress={handleInitDB} 
            color="secondary3"
            buttonStyle={styles.initDBButton} 
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
    backgroundColor: '#F8F9FA',
    justifyContent: 'flex-start',
  },
  backButton: {
    backgroundColor: colors.primary1,
    borderRadius: 8,
    padding: 4,
  },
  notificationIconWrapper: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  profileHeaderCard: {
    backgroundColor: 'rgba(73, 94, 87, 0.05)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary1,
  },
  profileHeaderContent: {
    gap: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Karla-Regular',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'MarkaziText-Medium',
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'MarkaziText-Medium',
    color: colors.textPrimary,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary7,
    borderWidth: 3,
    borderColor: colors.primary1,
    shadowColor: colors.primary1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarInitials: {
    color: colors.primary1,
    fontSize: 32,
    fontWeight: '700',
  },
  ProfileWrapperTitle: {
    fontSize: 24,
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
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    marginRight: 16,
    borderWidth: 3,
    borderColor: colors.primary1,
    shadowColor: colors.primary1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ProfileWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    padding: 16,
  },
  titleSmall: {
    fontSize: 12,
    color: colors.primary1,
    fontFamily: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatarButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  inputContainer: {
    width: '100%',
  },
  label: {
    fontWeight: '600',
    width: 90,
    color: '#333',
    fontSize: 16,
  },
  noData: {
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inputRow: {
    marginBottom: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputWithIcon: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Karla-Regular',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    height: 48,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    paddingHorizontal: 14,
    width: '100%',
    fontSize: 16,
    color: '#333',
    fontFamily: 'Karla-Regular',
  },
  checkBoxContainer: {
    gap: 8,
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
    marginTop: 4,
    marginBottom: 8,
    fontSize: 13,
    fontFamily: 'Karla-Regular',
  },
  LogoutButton: {
    marginTop: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  changePasswordButton: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DC3545',
    shadowColor: '#DC3545',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  initDBButton: {
    marginTop: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFA500',
    shadowColor: '#FFA500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discardButton: {
    flex: 1,
    borderColor: colors.primary1,
    borderWidth: 1.5,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  TextButtons: {
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Karla-Bold',
  },
  footerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    gap: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
 
});