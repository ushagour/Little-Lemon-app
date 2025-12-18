import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../config/colors';
import { getImageUrl } from '../../api/getImageUrl';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

/**
 * Card component with enhanced image handling.
 * Features:
 * - Automatic image loading and error detection
 * - Loading spinner while image loads
 * - Fallback UI with icon when image fails to load
 * - Responsive sizing for different devices
 * - Accessibility support
 */
const Card = ({ item }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (error) => {
    console.warn(`Image failed to load for ${item.name}:`, item.image, error);
    setImageLoading(false);
    setImageError(true);
  };

  const imageSize = isTablet ? 90 : 70;
  const isValidUrl = getImageUrl(item.image) && (getImageUrl(item.image).startsWith('https://') || getImageUrl(item.image).startsWith('https://'));
  return (
    <View style={styles.card} testID={`card-${item.name}`}>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        <Text style={styles.cardPrice}>{item.price}</Text>
      </View>

      {/* Image with loading and error states */}
      <View style={[styles.cardImageContainer, { width: imageSize, height: imageSize }]}>
        {isValidUrl ? (
          <>
            {imageLoading && (
              <ActivityIndicator size="small" color={colors.primary1} style={styles.loadingSpinner} />
            )}
            <Image
              source={{ uri: getImageUrl(item.image) }}
              style={[styles.cardImage, { width: imageSize, height: imageSize }]}
              onLoad={handleImageLoad}
              onError={handleImageError}
              accessible={true}
              accessibilityLabel={`${item.name} image`}
              testID={`card-image-${item.name}`}
            />
            {imageError && (
              <View style={[styles.cardImageFallback, { width: imageSize, height: imageSize }]}>
                <MaterialIcons name="image-not-supported" size={24} color={colors.primary1} />
              </View>
            )}
          </>
        ) : (
          <View style={[styles.cardImageFallback, { width: imageSize, height: imageSize }]}>
            <MaterialIcons name="no-photography" size={24} color={colors.primary1} />
            <Text style={styles.fallbackText}>No image</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Card;

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
  cardImageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isTablet ? 16 : 12,
  },
  cardImage: {
    borderRadius: 8,
  },
  cardImageFallback: {
    position: 'absolute',
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  loadingSpinner: {
    position: 'absolute',
    zIndex: 10,
  },
  fallbackText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    fontFamily: 'Karla-Regular',
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Karla-Bold',
    color: colors.textPrimary,
  },
  cardDescription: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Karla-Regular',
    marginBottom: 8,
  },
  cardPrice: {
    color: colors.secondary1,
    marginTop: 6,
    fontWeight: '700',
    fontFamily: 'Karla-Bold',
    fontSize: 16,
  },
});