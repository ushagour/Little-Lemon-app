import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Image, Pressable } from 'react-native';
import colors from '../../config/colors';
import Hero from '../../components/Hero';
import Label from '../../components/Forms/Label';
import { ScrollView } from 'react-native-gesture-handler';
import AppTextInput from '../../components/Forms/AppTextInput';
import AppButton from '../../components/Forms/AppButton';
import { useAuth } from '../../hooks/useAuth';

const RegisterScreen = ({ navigation }) => {
  const { completeOnboarding } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameIsValid, setNameIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Validation
  useEffect(() => {
    const trimmed = firstName.trim();
    const nameValid = trimmed.length > 0 && /^[A-Za-z\s]+$/.test(trimmed);
    setNameIsValid(nameValid);
    
    const emailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailIsValid(emailValid);
    
    const passValid = password.length >= 6;
    setPasswordIsValid(passValid);
    
    if (confirmPassword.length > 0) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [firstName, email, password, confirmPassword]);

  const handleRegister = async () => {
    if (!nameIsValid) {
      Alert.alert('Invalid Name', 'Please enter a valid name (letters and spaces only)');
      return;
    }
    if (!emailIsValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    if (!passwordIsValid) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters');
      return;
    }
    if (!passwordsMatch) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    // Register user
    const userData = { 
      firstName, 
      lastName,
      email 
    };
    
    const success = await completeOnboarding(userData);
    
    if (success) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } else {
      Alert.alert('Error', 'Failed to register. Please try again.');
    }
  };

  const formIsValid = nameIsValid && emailIsValid && passwordIsValid && passwordsMatch;

  return (
    <View style={styles.container}>
      <Hero />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Create Account</Text>
          <Image
            source={require('../../assets/images/Logo.png')}
          />
        </View>

        <Label text="First Name" required={true} />
        <AppTextInput
          style={[styles.input, !nameIsValid && firstName.length > 0 ? styles.inputError : null]}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
        />
        {!nameIsValid && firstName.length > 0 && (
          <Text style={styles.errorText}>Please enter a valid name (letters and spaces only).</Text>
        )}

        <Label text="Last Name" />
        <AppTextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
        />

        <Label text="Email" required={true} />
        <AppTextInput
          style={[styles.input, !emailIsValid && email.length > 0 ? styles.inputError : null]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
        />
        {!emailIsValid && email.length > 0 && (
          <Text style={styles.errorText}>Please enter a valid email address.</Text>
        )}

        <Label text="Password" required={true} />
        <AppTextInput
          style={[styles.input, !passwordIsValid && password.length > 0 ? styles.inputError : null]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          placeholder="Enter your password"
        />
        {!passwordIsValid && password.length > 0 && (
          <Text style={styles.errorText}>Password must be at least 6 characters.</Text>
        )}

        <Label text="Confirm Password" required={true} />
        <AppTextInput
          style={[styles.input, !passwordsMatch && confirmPassword.length > 0 ? styles.inputError : null]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          placeholder="Confirm your password"
        />
        {!passwordsMatch && confirmPassword.length > 0 && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        <AppButton
          title="Sign Up"
          onPress={handleRegister}
          color="primary1"
          disabled={!formIsValid}
          buttonStyle={styles.registerButton}
          textStyle={styles.buttonText}
        />

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
          </Pressable>
        </View>

        <View style={styles.linkContainer}>
          <Pressable onPress={() => navigation.navigate('Onboarding')}>
            <Text style={styles.link}>Continue as Guest</Text>
          </Pressable>
        </View>
      </ScrollView>

      <View style={styles.copyright}>
        <Text style={styles.copyrightText}>© 2026 Little Lemon. All rights reserved.</Text>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.secondary5,
  },
  wrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    color: colors.textPrimary,
    fontFamily: 'MarkaziText-Medium',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.inputBackground || '#F5F5F5',
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    color: colors.textPrimary || '#333',
    fontFamily: 'Karla-Regular',
    marginBottom: 15,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    marginTop: -10,
    marginBottom: 15,
    fontSize: 14,
  },
  registerButton: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  link: {
    fontSize: 14,
    color: colors.primary2,
    fontWeight: '600',
    fontFamily: 'Karla-Bold',
  },
  copyright: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: colors.white,
  },
  copyrightText: {
    color: colors.textPrimary,
    fontSize: 12,
    textAlign: 'center',
  },
});
