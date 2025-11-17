import { TextInput as RNTextInput, StyleSheet, View } from 'react-native';

const TextInput = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  styleInput,
  accessibilityLabel,
  ...rest
}) => {
  return (
    <View style={styles.wrapper}>
      <RNTextInput
        style={styleInput}
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

  wrapper: {
    width: '100%',
  },
});