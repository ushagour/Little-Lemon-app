import { useEffect, useState } from 'react';
import {  StyleSheet, Text, View } from 'react-native';
import TextInput from '../components/Forms/TextInput';
import Header from "../components/Header";
import Footer from '../components/Footer';

const OnboardingScreen = ({ navigation, route }) => {
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

      {/* Content */}

    <View style={styles.content}>
        <Text style={styles.title}>Let us get to know you</Text>

                <Text style={styles.label}>First Name</Text>
          <TextInput
            style={[styles.input, !nameIsValid && firstName.length > 0 ? styles.inputError : null]}
            value={firstName}
            onChangeText={setFirstName}
            accessibilityLabel="first-name"
          />
          {!nameIsValid && firstName.length > 0 ? (
              <Text style={styles.errorText}>Please enter a valid name (letters and spaces only).</Text>
            ) : null}



                <Text style={styles.label}>Email</Text>
         <TextInput
            style={[styles.input, !emailIsValid && email.length > 0 ? styles.inputError : null]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            accessibilityLabel="email"
          />
          {!emailIsValid && email.length > 0 ? (
            <Text style={styles.errorText}>Please enter a valid email address.</Text>
          ) : null}
        </View>

      <Footer
        formIsValid={formIsValid}
        onPress={() => 
    
          
          navigation.navigate('Profile', { firstName, email })
        }
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
    flex: 3, // 3 parts of the screen (main section)
    backgroundColor: 'rgba(167, 183, 194, 1)',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: '20%',
    marginBottom: '50%',
    color: '#333',
  },
    label: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  inputError: {
    borderColor: 'red',
  },
});