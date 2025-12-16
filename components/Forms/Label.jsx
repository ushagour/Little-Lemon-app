import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import colors from '../../config/colors'

const Label = ({ 
  text = '', 
  required = false, 
  style = {}, 
  textStyle = {},
  requiredTextColor = '#EE9972' 
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.labelText, textStyle]}>
        {text}
        {required && <Text style={[styles.requiredIndicator, { color: requiredTextColor }]}> *</Text>}
      </Text>
    </View>
  )
}

export default Label

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  labelText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary || '#333',
    fontFamily: 'Karla-Medium',
  },
  requiredIndicator: {
    fontWeight: '700',
  },
})