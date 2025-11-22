import React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";

import colors from "../../config/colors";

function AppButton({ title, children, onPress, color = "primary1", buttonStyle, textStyle, disabled = false }) {
  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        buttonStyle,
        { backgroundColor: colors[color] },
        pressed && !disabled ? styles.buttonPressed : null,
        disabled ? styles.buttonDisabled : null,
        styles.button,
      ]}
      onPress={onPress}
    >
      {children ? (
        <View>{children}</View>
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: colors.black,
    fontSize: 18,
    textTransform: "uppercase",
  },
   button: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default AppButton;
