import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Image, TouchableOpacity } from 'react-native';
import colors from '../../config/colors';


const Card = ({item}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">{item.description}</Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>
      <Image source={{ uri: item.image }  } style={styles.cardImage} />

    </View>
  )
}

export default Card

const styles = StyleSheet.create({
      card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      },
      cardImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
      cardBody: { flex: 1 },
      cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
      cardDescription: { color: '#666' },
      cardPrice: { color: '#666', marginTop: 6, fontWeight: '700' ,fontFamily:'Arial', fontSize:16},
})