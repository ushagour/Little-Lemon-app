import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header';
import colors from '../../config/colors';
import Label from '../../components/Forms/Label';
import AppTextInput from '../../components/Forms/AppTextInput';
import AppButton from '../../components/Forms/AppButton';
import { useAuth } from '../../hooks/useAuth';

const ChangePassword = ({ navigation }) => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordValid, setCurrentPasswordValid] = useState(false);
  const [newPasswordValid, setNewPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  // Validation
  useEffect(() => {
    setCurrentPasswordValid(currentPassword.length >= 6);
    setNewPasswordValid(newPassword.length >= 8);
    setPasswordsMatch(newPassword.length > 0 && newPassword === confirmPassword);
  }, [currentPassword, newPassword, confirmPassword]);

  const handleChangePassword = async () => {
    if (!currentPasswordValid) {
      Alert.alert('Invalid Current Password', 'Current password must be at least 6 characters');
      return;
    }
    if (!newPasswordValid) {
      Alert.alert('Invalid New Password', 'New password must be at least 8 characters');
      return;
    }
    if (!passwordsMatch) {
      Alert.alert('Passwords Do Not Match', 'New password and confirmation must match');
      return;
    }

    // In a real app, this would call an API to change the password
    // For now, we'll simulate success
    Alert.alert(
      'Success',
      'Your password has been changed successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            // Clear form and go back
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const isFormValid = currentPasswordValid && newPasswordValid && passwordsMatch;

  return (
    <View style={styles.container}>
      <Header
        leftContent={
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Ionicons name="lock-closed" size={48} color={colors.primary1} />
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
              Please enter your current password and choose a new secure password
            </Text>
          </View>

          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Label text="Current Password" required={true} />
            <View style={styles.passwordInputContainer}>
              <AppTextInput
                style={[
                  styles.input,
                  !currentPasswordValid && currentPassword.length > 0 ? styles.inputError : null,
                ]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                placeholder="Enter current password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Ionicons
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.primary1}
                />
              </TouchableOpacity>
            </View>
            {!currentPasswordValid && currentPassword.length > 0 && (
              <Text style={styles.errorText}>Current password must be at least 6 characters</Text>
            )}
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Label text="New Password" required={true} />
            <View style={styles.passwordInputContainer}>
              <AppTextInput
                style={[
                  styles.input,
                  !newPasswordValid && newPassword.length > 0 ? styles.inputError : null,
                ]}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                placeholder="Enter new password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowNewPassword(!showNewPassword)}
              >
                <Ionicons
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.primary1}
                />
              </TouchableOpacity>
            </View>
            {!newPasswordValid && newPassword.length > 0 && (
              <Text style={styles.errorText}>New password must be at least 8 characters</Text>
            )}
            {newPasswordValid && (
              <View style={styles.passwordStrength}>
                <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                <Text style={styles.strengthText}>Strong password</Text>
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Label text="Confirm New Password" required={true} />
            <View style={styles.passwordInputContainer}>
              <AppTextInput
                style={[
                  styles.input,
                  !passwordsMatch && confirmPassword.length > 0 ? styles.inputError : null,
                ]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm new password"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={colors.primary1}
                />
              </TouchableOpacity>
            </View>
            {!passwordsMatch && confirmPassword.length > 0 && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
            {passwordsMatch && confirmPassword.length > 0 && (
              <View style={styles.passwordStrength}>
                <Ionicons name="checkmark-circle" size={16} color="#28a745" />
                <Text style={styles.strengthText}>Passwords match</Text>
              </View>
            )}
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Ionicons
                name={newPassword.length >= 8 ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={newPassword.length >= 8 ? '#28a745' : '#999'}
              />
              <Text style={styles.requirementText}>At least 8 characters</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={/[A-Z]/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={/[A-Z]/.test(newPassword) ? '#28a745' : '#999'}
              />
              <Text style={styles.requirementText}>At least one uppercase letter (optional)</Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons
                name={/[0-9]/.test(newPassword) ? 'checkmark-circle' : 'ellipse-outline'}
                size={16}
                color={/[0-9]/.test(newPassword) ? '#28a745' : '#999'}
              />
              <Text style={styles.requirementText}>At least one number (optional)</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <AppButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              color="white"
              buttonStyle={[styles.button, styles.cancelButton]}
              textStyle={styles.cancelButtonText}
            />
            <AppButton
              title="Change Password"
              onPress={handleChangePassword}
              color="primary1"
              disabled={!isFormValid}
              buttonStyle={[styles.button, styles.changeButton]}
              textStyle={styles.changeButtonText}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary4,
  },
  backButton: {
    backgroundColor: colors.primary1,
    borderRadius: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'MarkaziText-Medium',
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  passwordInputContainer: {
    position: 'relative',
  },
  input: {
    width: '100%',
  },
  inputError: {
    borderColor: colors.danger || '#DC3545',
    borderWidth: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  errorText: {
    color: colors.danger || '#DC3545',
    fontSize: 12,
    fontFamily: 'Karla-Regular',
    marginTop: 4,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  strengthText: {
    color: '#28a745',
    fontSize: 12,
    fontFamily: 'Karla-Regular',
    marginLeft: 4,
  },
  requirementsBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.secondary3,
  },
  requirementsTitle: {
    fontSize: 14,
    fontFamily: 'Karla-Bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: 'Karla-Regular',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.primary1,
  },
  cancelButtonText: {
    color: colors.primary1,
    fontFamily: 'Karla-Bold',
  },
  changeButton: {
    backgroundColor: colors.primary1,
  },
  changeButtonText: {
    color: colors.white,
    fontFamily: 'Karla-Bold',
  },
});