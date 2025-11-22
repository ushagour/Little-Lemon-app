import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';

const SplashScreen = ({ onGetStarted = () => {} }) => {
  return (
   <ImageBackground
        blurRadius={15}   // 👈 adjust blur level
        style={styles.background}
        source={require("../assets/images/Lemon dessert.png")}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.tagline}>Welcome to Little Lemon</Text>
          <Image style={styles.logo} source={require("../assets/images/Logo.png")} />
        </View>
        <View style={styles.buttonsContainer}>
          {/* <Button title="Login"  onPress={()=>{navigation.navigate("Login")}} />
          <Button title="Register" color="secondary"  onPress={()=>{navigation.navigate("Register")}} /> */}
        </View>
        <View style={styles.splashContainer}>
          <Text style={styles.copyrightText}>Copyright © 2025 </Text>
        </View>
      </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 40,
    width: "100%",
  },

  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",

  },
  tagline: {
    fontSize: 25,
    color: "white",
    fontFamily: "Arial",
    fontStyle: "bold",
    fontWeight: "600",
    paddingVertical: 20,
  },
  splashContainer: {
    position: 'absolute',
    bottom: 20, // Adjust based on the layout
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
});