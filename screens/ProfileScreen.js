import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const ProfileScreen = ({ route, navigation }) => {
  const { firstName = '', email = '' } = route?.params || {};

  const hasData = Boolean(firstName || email);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {hasData ? (
        <>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{firstName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.noData}>No profile data provided.</Text>
      )}

      <Pressable
        style={({ pressed }) => [styles.editButton, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate('Onboarding', { firstName, email })}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </Pressable>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EDEFEE',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    width: 80,
    color: '#333',
  },
  value: {
    color: '#333',
  },
  noData: {
    color: '#666',
    marginBottom: 20,
  },
  editButton: {
    marginTop: 24,
    backgroundColor: '#2E86AB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
