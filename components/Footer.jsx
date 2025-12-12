import { StyleSheet, View, Text } from 'react-native';
import AppButton from './Forms/AppButton';
import colors from '../config/colors';

const Footer = ({ formIsValid = false, onPress }) => {
  return (
    <View style={styles.footer}>
      <AppButton
        title="Next"
        onPress={onPress}
        disabled={!formIsValid}
        buttonStyle={[styles.button, !formIsValid && styles.buttonDisabled]}
        textStyle={styles.buttonText}
      />
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
    color: colors.black,
    fontStyle: 'bold',
    fontSize: 16,
    fontWeight: '600',
  },
 
});