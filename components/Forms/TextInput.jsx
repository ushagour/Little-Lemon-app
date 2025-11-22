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
  
  );
};

export default TextInput;

