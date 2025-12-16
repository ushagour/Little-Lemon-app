import { useEffect, useState } from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInput from '../components/Forms/AppTextInput';
import Header from "../components/Header";
import Footer from '../components/Footer';
import colors from '../config/colors';
import Hero from '../components/Hero';
import Label from '../components/Forms/Label';
import { ScrollView } from 'react-native-gesture-handler';
import AppTextInput from '../components/Forms/AppTextInput';
const PROFILE_KEY = '@littlelemon_profile';

const OnboardingScreen = ({ navigation, route, onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  // validity states
  const [nameIsValid, setNameIsValid] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(false);
  const [formIsValid, setFormIsValid] = useState(false);

  // Validate whenever inputs change. This approach centralizes validation
  // logic and updates the derived `formIsValid` state which is passed to Footer.
  useEffect(() => {
    const trimmed = firstName.trim();
    const nameValid = trimmed.length > 0 && /^[A-Za-z\s]+$/.test(trimmed);
    setNameIsValid(nameValid);

    const emailValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setEmailIsValid(emailValid);

    setFormIsValid(nameValid && emailValid);
  }, [firstName, email]);

  // If the screen was opened with params (e.g. for editing), prefill the inputs.
  useEffect(() => {
    const params = route?.params || {};
    if (params.firstName && !firstName) setFirstName(params.firstName);
    if (params.email && !email) setEmail(params.email);
  }, [route?.params]);


  return (


   <View style={styles.container}>
      {/* Header */}
          <Header />
      <Hero />

      {/* Content */}

    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>


          <Label  text="Name" required={true} />
          <AppTextInput
            style={[styles.input, !nameIsValid && firstName.length > 0 ? styles.inputError : null]}
            value={firstName}
            onChangeText={setFirstName}
          />
          {!nameIsValid && firstName.length > 0 ? (
              <Text style={styles.errorText}>Please enter a valid name (letters and spaces only).</Text>
            ) : null}


          <Label  text="Email" required={true} />
         <AppTextInput
            style={[styles.input, !emailIsValid && email.length > 0 ? styles.inputError : null]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />


          {!emailIsValid && email.length > 0 ? (
            <Text style={styles.errorText}>Please enter a valid email address.</Text>
          ) : null}

        </ScrollView>

      <Footer
        formIsValid={formIsValid}
        onPress={async () => {
          // Persist minimal profile info for later use in Profile screen
          try {
            const profile = { firstName, email, isAuthenticated: true };
            await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
          } catch (e) {
            console.log('Failed to save onboarding profile', e);
          }

          // Mark onboarding as complete
          if (onComplete) {
            onComplete();
          }
          // Navigate to Home with user data
          navigation.navigate('Home');
        }}
      />
    </View>
  );
};

export default OnboardingScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1, // take full screen height
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.secondary5,
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
    marginTop: 5,
    marginBottom: 15,
  },
});