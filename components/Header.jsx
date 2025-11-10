  import { Image, StyleSheet, View } from 'react-native';

  const Header = () => {
    return (
      <View style={styles.header}>
        <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
    );
  };

  export default Header;

  const styles = StyleSheet.create({
      header: {
      height: 64, // compact header height so logo has minimal surrounding space
      backgroundColor: '#EDEFEE',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    },

    logo: {
      width: 150,
      height: 50,
    },

  });