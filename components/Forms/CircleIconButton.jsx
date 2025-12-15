import { View, Button, TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from '@expo/vector-icons';

export default function CircleIconButton({
  iconName,
  style,
  iconStyle,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={[buttonStyle.primaryIconBtn, style]}
      onPress={onPress}
    >
      <Ionicons
        name={iconName}
        size={24}
        style={[buttonStyle.icon, iconStyle]}
      />
    </TouchableOpacity>
  );
}


const buttonStyle = {
  primaryIconBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#495E57",
    borderRadius: 999,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  icon: {
    color: "#F4CE14",
  },
  primary: {
    height: 40,
    borderWidth: 1,
    borderColor: "#495E57",
    backgroundColor: "#495E57",
    paddingHorizontal: 16,
    padingVertical: 8,
    borderRadius: 12,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  primaryText: {
    color: "#F4CE14",
    textAlign: "center",
    fontWeight: "bold",
  },
  disabled: {
    height: 40,
    borderWidth: 1,
    backgroundColor: "#cccccc",
    borderColor: "transparent",
    paddingHorizontal: 16,
    padingVertical: 8,
    borderRadius: 12,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  disabledText: {
    color: "#aaaaaa", // Text color for disabled button
    textAlign: "center",
  },
  secondary: {
    height: 40,
    borderWidth: 1,
    borderColor: "#EE9972",
    backgroundColor: "#EE9972",
    paddingHorizontal: 16,
    padingVertical: 8,
    borderRadius: 12,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  secondaryText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
  tertiary: {
    height: 40,
    borderWidth: 1,
    borderColor: "#495E57",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    padingVertical: 8,
    borderRadius: 12,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  tertiaryText: {
    color: "#495E57",
    textAlign: "center",
    fontWeight: "bold",
  },
};
