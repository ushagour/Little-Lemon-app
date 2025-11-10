import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';

const TextInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  accessibilityLabel,
  ...rest
}) => {
  return (
    <View style={styles.wrapper}>
      <RNTextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        accessibilityLabel={accessibilityLabel}
        {...rest}
      />
    </View>
  );
};

export default TextInput;

const styles = StyleSheet.create({

  input: {
    height: 50,
    minWidth: 300,
    borderWidth: 3,
    borderColor: '#4F6770',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    
  },
});