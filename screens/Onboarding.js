import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import TextInput from '../components/Forms/TextInput';
import Header from "../components/Header";

const Onboarding = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');

  // Validation rules
  const nameIsValid = useMemo(() => {
    const trimmed = firstName.trim();
    if (!trimmed) return false;
    // allow letters and spaces only
    return /^[A-Za-z\s]+$/.test(trimmed);
  }, [firstName]);

  const emailIsValid = useMemo(() => {
    if (!email) return false;
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const formIsValid = nameIsValid && emailIsValid;

  return (


   <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Header</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>Main Content Area</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer</Text>
      </View>
    </View>
























    // <View style={styles.container}>
    //  <Header />

    //   <View style={styles.content}>
    //     <Text style={styles.title}>Let us get to know you better</Text>

    //     <TextInput
    //       style={[styles.input, !nameIsValid && firstName.length > 0 ? styles.inputError : null]}
    //       placeholder="Enter your name"
    //       value={firstName}
    //       onChangeText={setFirstName}
    //       accessibilityLabel="first-name"
    //     />
    //     {!nameIsValid && firstName.length > 0 ? (
    //       <Text style={styles.errorText}>Please enter a valid name (letters and spaces only).</Text>
    //     ) : null}

    //     <TextInput
    //       style={[styles.input, !emailIsValid && email.length > 0 ? styles.inputError : null]}
    //       placeholder="Enter your email"
    //       value={email}
    //       onChangeText={setEmail}
    //       keyboardType="email-address"
    //       autoCapitalize="none"
    //       accessibilityLabel="email"
    //     />
    //     {!emailIsValid && email.length > 0 ? (
    //       <Text style={styles.errorText}>Please enter a valid email address.</Text>
    //     ) : null}
    //   </View>

    //   <View style={styles.footer}>
    //     <Pressable
    //       style={({ pressed }) => [
    //         styles.button,
    //         !formIsValid ? styles.buttonDisabled : null,
    //         pressed ? styles.buttonPressed : null,
    //       ]}
    //       disabled={!formIsValid}
    //       onPress={() => {
    //         // intentionally no action for now
    //       }}
    //     >
    //       <Text style={[styles.buttonText, !formIsValid ? styles.buttonTextDisabled : null]}>Next</Text>
    //     </Pressable>
    //   </View>
    // </View>
  );
};

export default Onboarding;


const styles = StyleSheet.create({
  container: {
    flex: 1, // take full screen height
  },
  header: {
    flex: 1, // 1 part of the screen
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 3, // 3 parts of the screen (main section)
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1, // 1 part of the screen
    backgroundColor: '#1976D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
  },
  contentText: {
    fontSize: 18,
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
  },
});