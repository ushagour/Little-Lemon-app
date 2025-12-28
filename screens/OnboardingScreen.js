import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import Header from "../components/Header";
import colors from '../config/colors';
import Hero from '../components/Hero';
import { ScrollView } from 'react-native-gesture-handler';
import AppButton from '../components/Forms/AppButton';
import { useAuth } from '../hooks/useAuth';

const OnboardingScreen = ({ navigation }) => {
  const { createGuestUser } = useAuth();

  const handleContinueAsGuest = () => {
    createGuestUser();
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };


  return (
    <View style={styles.container}>
      <Hero />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.wrapper}>
          <Text style={styles.title}>Welcome to Little Lemon</Text>
          <Image
            source={require('../assets/images/Logo.png')}
            style={styles.logo}
          />
          <Text style={styles.subtitle}>
            Discover delicious Mediterranean cuisine and enjoy a delightful dining experience.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <AppButton
            title="Login"
            onPress={() => navigation.navigate('Login')}
            color="primary1"
            buttonStyle={styles.button}
            textStyle={styles.buttonText}
          />

          <AppButton
            title="Sign Up"
            onPress={() => navigation.navigate('Register')}
            color="primary2"
            buttonStyle={styles.button}
          />

          <AppButton
           onPress={handleContinueAsGuest}
              title="Continue as Guest"
              textStyle={styles.guestButtonText}
              buttonStyle={styles.guestButton}
            color=""

          />
        </View>
      </ScrollView>
      <View style={styles.copyright}>
        <Text style={styles.copyrightText}>© 2026 Little Lemon. All rights reserved.</Text>
      </View>
    </View>
  );
};

export default OnboardingScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colors.secondary5,
    justifyContent: 'center',
  },
  wrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    color: colors.textPrimary,
    fontFamily: 'MarkaziText-Medium',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    width: '100%',
    // marginTop: 12,
    borderRadius: 6,
    borderWidth: 1,
    fontFamily: 'Karla-Bold',
    borderColor: colors.primary1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestButtonText: {
    color: colors.primary1,
    fontSize: 16,
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