import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Header from '../components/Header';
import colors from '../config/colors';
import AppButton from '../components/Forms/AppButton';
import Ligne from '../components/ui/Ligne';
import { formatPriceMAD } from '../utils/currency';
import { getImageUrl } from '../api/getImageUrl';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const OrderDetailScreen = ({ navigation, route }) => {
  const { order } = route.params;
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed':
        return '#FFA500';
      case 'preparing':
        return '#3498db';
      case 'ready':
        return '#2ecc71';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return colors.primary1;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed':
        return 'receipt';
      case 'preparing':
        return 'restaurant';
      case 'ready':
        return 'check-circle';
      case 'delivered':
        return 'delivery-dining';
      case 'cancelled':
        return 'cancel';
      default:
        return 'info';
    }
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting your review.');
      return;
    }

    // Here you would typically save the review to your backend
    Alert.alert(
      'Review Submitted',
      'Thank you for your feedback!',
      [
        {
          text: 'OK',
          onPress: () => {
            setHasReviewed(true);
          },
        },
      ]
    );
  };

  const renderOrderItem = ({ item }) => {
    const imageUrl = item.image ? getImageUrl(item.image) : null;
    const validUrl = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'));

    return (
      <View style={styles.orderItem}>
        <View style={styles.itemImageContainer}>
          {validUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
          ) : (
            <View style={[styles.itemImage, styles.imagePlaceholder]}>
              <MaterialIcons name="restaurant" size={24} color={colors.primary1} />
            </View>
          )}
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
          {item.extras && item.extras.length > 0 && (
            <Text style={styles.itemExtras}>
              Extras: {item.extras.map(e => e.label).join(', ')}
            </Text>
          )}
        </View>
        <Text style={styles.itemPrice}>{formatPriceMAD(item.price * item.quantity)}</Text>
      </View>
    );
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => !hasReviewed && setRating(star)}
            disabled={hasReviewed}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={36}
              color="#FFB81C"
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        leftContent={
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        }
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order Status Section */}
        <View style={styles.section}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              <MaterialIcons
                name={getStatusIcon(order.status)}
                size={32}
                color={getStatusColor(order.status)}
              />
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.sectionTitle}>Order Status</Text>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.orderMetadata}>
            <View style={styles.metadataRow}>
              <Ionicons name="receipt-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.metadataLabel}>Order ID:</Text>
              <Text style={styles.metadataValue}>{order.id}</Text>
            </View>
            <View style={styles.metadataRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.metadataLabel}>Date:</Text>
              <Text style={styles.metadataValue}>
                {new Date(order.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metadataRow}>
              <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.metadataLabel}>Time:</Text>
              <Text style={styles.metadataValue}>
                {new Date(order.date).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>

        <Ligne />

        {/* Order Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          <FlatList
            data={order.items}
            renderItem={renderOrderItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            scrollEnabled={false}
          />
        </View>

        <Ligne />

        {/* Delivery Information */}
        {order.deliveryAddress && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Information</Text>
              <View style={styles.infoRow}>
                <Ionicons name="location" size={20} color={colors.primary1} />
                <Text style={styles.infoText}>{order.deliveryAddress}</Text>
              </View>
              {order.phoneNumber && (
                <View style={styles.infoRow}>
                  <Ionicons name="call" size={20} color={colors.primary1} />
                  <Text style={styles.infoText}>{order.phoneNumber}</Text>
                </View>
              )}
              {order.specialInstructions && (
                <View style={styles.infoRow}>
                  <Ionicons name="document-text" size={20} color={colors.primary1} />
                  <Text style={styles.infoText}>{order.specialInstructions}</Text>
                </View>
              )}
            </View>
            <Ligne />
          </>
        )}

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPriceMAD(order.subtotal || order.total)}</Text>
          </View>
          {order.tax && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>{formatPriceMAD(order.tax)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPriceMAD(order.total)}</Text>
          </View>
        </View>

        <Ligne />

        {/* Review Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {hasReviewed ? 'Your Review' : 'Rate Your Order'}
          </Text>
          
          {renderStarRating()}

          {!hasReviewed ? (
            <>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your experience with this order..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                value={review}
                onChangeText={setReview}
                textAlignVertical="top"
              />
              <AppButton
                title="Submit Review"
                onPress={handleSubmitReview}
                color="primary1"
                buttonStyle={styles.submitButton}
              />
            </>
          ) : (
            <View style={styles.reviewSubmittedContainer}>
              <Ionicons name="checkmark-circle" size={48} color={colors.primary1} />
              <Text style={styles.reviewSubmittedText}>
                Thank you for your feedback!
              </Text>
              {review && (
                <Text style={styles.submittedReviewText}>{review}</Text>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        {order.status === 'delivered' && (
          <View style={styles.actionButtons}>
            <AppButton
              title="Reorder"
              onPress={() => {
                Alert.alert(
                  'Reorder',
                  'Add these items to your cart?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Yes',
                      onPress: () => {
                        navigation.navigate('Home');
                        Alert.alert('Success', 'Items added to cart!');
                      },
                    },
                  ]
                );
              }}
              color="primary1"
              buttonStyle={styles.reorderButton}
            />
          </View>
        )}

        {order.status === 'placed' && (
          <View style={styles.actionButtons}>
            <AppButton
              title="Cancel Order"
              onPress={() => {
                Alert.alert(
                  'Cancel Order',
                  'Are you sure you want to cancel this order?',
                  [
                    { text: 'No', style: 'cancel' },
                    {
                      text: 'Yes, Cancel',
                      style: 'destructive',
                      onPress: () => {
                        Alert.alert('Order Cancelled', 'Your order has been cancelled.');
                        navigation.goBack();
                      },
                    },
                  ]
                );
              }}
              color="danger"
              buttonStyle={[styles.reorderButton, { backgroundColor: '#e74c3c' }]}
            />
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    fontFamily: 'MarkaziText-Medium',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'MarkaziText-Medium',
  },
  orderMetadata: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    marginRight: 4,
  },
  metadataValue: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  orderItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImageContainer: {
    marginRight: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imagePlaceholder: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  itemExtras: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: colors.primary1,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'MarkaziText-Medium',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary1,
    fontFamily: 'MarkaziText-Medium',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  star: {
    marginHorizontal: 4,
  },
  reviewInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  reviewSubmittedContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  reviewSubmittedText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 8,
  },
  submittedReviewText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  actionButtons: {
    padding: 16,
    backgroundColor: '#fff',
  },
  reorderButton: {
    marginTop: 8,
  },
});
