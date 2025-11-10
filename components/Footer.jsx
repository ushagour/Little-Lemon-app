import { StyleSheet, View,Pressable, Text } from 'react-native';

const Footer = ({ formIsValid = false, onPress = () => {console.log("Footer pressed")} }) => {
  
  return (

    <View style={styles.footer}>
      <Pressable

        style={({ pressed }) => [
          styles.button,
          !formIsValid && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        disabled={!formIsValid}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Next</Text>
      </Pressable>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 50,
    backgroundColor: '#CAD4E5',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#9AA8B3',
  },
  buttonDisabled: {
    backgroundColor:'rgba(167, 183, 194, 1)'
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#4F6770',
    fontSize: 16,
    fontWeight: '600',
  },
 
});