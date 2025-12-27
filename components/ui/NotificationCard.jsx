import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import colors from '../../config/colors';
import { Ionicons } from '@expo/vector-icons';
import { useOrders } from '../../hooks/useOrders';

const NotificationCard = () => {
      const { orders, markOrderAsRead, markAllAsRead, unreadCount } = useOrders();

  return (
   <View style={styles.notificationSection}>
              <View style={styles.notificationHeader}>
                <Text style={styles.ProfileWrapperTitle}>Order Notifications</Text>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
                    <Text style={styles.markAllText}>Mark all as read</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {orders.slice(0, 5).map((order) => (
                <TouchableOpacity 
                  key={order.id} 
                  style={[
                    styles.notificationItem,
                    !order.read && styles.unreadNotification
                  ]}
                  onPress={() => markOrderAsRead(order.id)}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons 
                      name={order.read ? "checkmark-circle" : "notifications"} 
                      size={24} 
                      color={order.read ? colors.primary1 : '#FF6B6B'} 
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      Order {order.status === 'placed' ? 'Placed' : 'Updated'}
                      {!order.read && <Text style={styles.newBadge}> • NEW</Text>}
                    </Text>
                    <Text style={styles.notificationDescription}>
                      {order.items.length} item(s) - ${order.total.toFixed(2)}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
  )
}

export default NotificationCard

const styles = StyleSheet.create({
     notificationSection: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  markAllButton: {
    padding: 6,
  },
  markAllText: {
    color: colors.primary1,
    fontSize: 14,
    fontWeight: '600',
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  unreadNotification: {
    backgroundColor: '#FFF8F0',
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  notificationIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  newBadge: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '700',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
})