import React from "react";
import {
  View,
  TextInput,
  Animated,
  Keyboard,
  Dimensions,
  Platform,
  ToastAndroid,
  Alert,
  StyleSheet,
} from "react-native";
import { useState, useRef } from "react";
import colors from "../../config/colors";
import { Ionicons } from '@expo/vector-icons';
import CircleIconButton from "./CircleIconButton";

const SearchView = ({ searchText, onChange }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputWidth = useRef(new Animated.Value(36)).current; // Initial width for the circle icon
  const textInputRef = useRef(null);

  const showToast = (message) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert("Notice", message);
    }
  };

  const iconPressed = () => {
    if (isExpanded && searchText?.trim()) {
      showToast(`Searching for "${searchText.trim()}"`);
      Keyboard.dismiss();
    } else {
      expandSearchBar(false);
    }
  };
  const expandSearchBar = () => {
    if (!isExpanded) {
      // Expand animation
      Animated.timing(inputWidth, {
        toValue: SCREEN_WIDTH - 36, // Final width for expanded search bar
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsExpanded(true);
        textInputRef.current?.focus(); // Focus the input field
      });
    } else if (searchText === "") {
      // Collapse animation
      Keyboard.dismiss();
      Animated.timing(inputWidth, {
        toValue: 36, // Reset width to initial size
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setIsExpanded(false);
      });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.searchBar, { width: inputWidth }]}>
        {isExpanded ? (
          <View style={styles.expandContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor={colors.white}
              onChangeText={onChange}
              value={searchText}
              onBlur={() => {
                expandSearchBar(); // Collapse when the input loses focus
              }}
            />
            
            <Ionicons
              name="search"        
              size={24}
              color={colors.white}
              style={styles.icon}
              onPress={iconPressed}
            />
          </View>
        ) : (
          <CircleIconButton
            iconName="search"
            style={styles.searchButton}
            iconStyle={styles.searchIcon}
            onPress={expandSearchBar}
          />
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  expandContainer: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  container: {
    width: "100%",
    
  },
  searchBar: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 18,
    height: 36,
    overflow: "hidden",
  },
  searchButton: {
    backgroundColor: colors.highlight1,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  searchIcon: {
    color: colors.white,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: colors.white,
    borderRadius: 6,
    paddingHorizontal: 15,
  },
  icon: {
    position: "absolute",
    right: 8,
    top: 6,
    zIndex: 1,
  },
});

export default SearchView;
