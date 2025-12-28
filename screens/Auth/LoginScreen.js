import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, Image, Pressable } from 'react-native';
import colors from '../../config/colors';
import Hero from '../../components/Hero';
import Label from '../../components/Forms/Label';
import { ScrollView } from 'react-native-gesture-handler';
import AppTextInput from '../../components/Forms/AppTextInput';
import AppButton from '../../components/Forms/AppButton';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  // Validate email
  useEffect(() => {
    const emailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailIsValid(emailValid);
    const passValid = password.length >= 6;
    setPasswordIsValid(passValid);
  }, [email, password]);

  const handleLogin = async () => {
    if (!emailIsValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    if (!passwordIsValid) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters');
      return;
    }

    // Simulate login - in real app, this would call an API
    const loginData = { email, password };
    const success = await login(loginData);
    
    if (success) {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } else {
      Alert.alert('Error', 'Failed to login. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Hero />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Welcome Back</Text>
          <Image
            source={require('../../assets/images/small_logo.png')}
            style={styles.logo}
          />
        </View>

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

        <AppButton
          title="Login"
          onPress={handleLogin}
          color="primary1"
          disabled={!emailIsValid || !passwordIsValid}
          buttonStyle={styles.loginButton}
          textStyle={styles.buttonText}
        />

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}>Sign Up</Text>
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

export default LoginScreen;

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
  loginButton: {
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
