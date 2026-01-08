import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native';
import React, { useState, useCallback, useMemo } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../config/colors';
import { getImageUrl } from '../../api/getImageUrl';
import { useNavigation } from '@react-navigation/native';
import { formatPriceMAD } from '../../utils/currency';


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
const Card = React.memo(({ item }) => {
  const navigation = useNavigation();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback((error) => {
    // console.warn(`Image failed to load for ${item.name}:`, item.image, error);
    setImageLoading(false);
    setImageError(true);
  }, [item.name, item.image]);

  const imageSize = useMemo(() => (isTablet ? 90 : 70), []);
  const isValidUrl = useMemo(
    () => getImageUrl(item.image) && (getImageUrl(item.image).startsWith('https://') || getImageUrl(item.image).startsWith('https://')),
    [item.image]
  );
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { item })}
      activeOpacity={0.8}
      testID={`card-${item.name}`}
    >
      <View style={styles.cardBody}>
        {/* Title with Rating */}
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          {item.rating && (
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={14} color="#FFB81C" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>

        {/* Availability Badge */}
        {item.available === false && (
          <View style={styles.unavailableBadge}>
            <Text style={styles.unavailableText}>Out of Stock</Text>
          </View>
        )}

        <Text style={styles.cardDescription} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, styles[`tag_${tag}`]]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Price and Prepare Time */}
        <View style={styles.footerRow}>
          <Text style={styles.cardPrice}>{formatPriceMAD(item.price)}</Text>
          {item.prepareTime && (
            <View style={styles.prepareTimeContainer}>
              <MaterialIcons name="schedule" size={14} color="#999" />
              <Text style={styles.prepareTimeText}>{item.prepareTime}</Text>
            </View>
          )}
        </View>
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
    </TouchableOpacity>
  );

});  
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Karla-Bold',
    color: colors.textPrimary,
    flex: 1,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
    color: '#333',
    fontFamily: 'Karla-Bold',
  },
  unavailableBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  unavailableText: {
    fontSize: 11,
    color: '#C41E3A',
    fontWeight: '600',
    fontFamily: 'Karla-Bold',
  },
  cardDescription: {
    color: '#666',
    fontSize: 13,
    fontFamily: 'Karla-Regular',
    marginBottom: 6,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 4,
  },
  tag_vegetarian: {
    backgroundColor: '#E8F5E9',
  },
  tag_vegetarian_text: {
    color: '#2E7D32',
  },
  tag_healthy: {
    backgroundColor: '#E3F2FD',
  },
  tag_healthy_text: {
    color: '#1565C0',
  },
  tag_fresh: {
    backgroundColor: '#FCE4EC',
  },
  tag_fresh_text: {
    color: '#C2185B',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    fontFamily: 'Karla-Bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  cardPrice: {
    color: colors.secondary1,
    fontWeight: '700',
    fontFamily: 'Karla-Bold',
    fontSize: 16,
  },
  prepareTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  prepareTimeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'Karla-Regular',
  },
});

