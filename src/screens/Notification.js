import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import {ORDER_GET_BY_USER_API, API_BASE_URL} from '../config/api';

const {width, height} = Dimensions.get('window');

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // UserID từ dữ liệu thực tế
  const userId = '68633e54628e8c899e05f51b';

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Lấy đơn hàng của user cụ thể
      const orderResponse = await fetch(`${ORDER_GET_BY_USER_API}/${userId}`);
      const orders = await orderResponse.json();

      console.log('📦 Orders fetched for userId:', userId);
      console.log('📊 Total orders:', orders.length);

      // Tạo notifications từ products trong các đơn hàng
      const cartNotifications = [];
      orders.forEach(order => {
        console.log('🔍 Processing order:', order._id);

        order.orderItems.forEach((item, index) => {
          cartNotifications.push({
            id: `order_${order._id}_item_${item._id}`,
            type: 'cart',
            title: '🛒 Sản phẩm đã đặt',
            subtitle: item.name_product,
            description: `Size: ${item.size.trim()} - SL: ${
              item.quantity
            } - ${formatPrice(item.unit_price_item)}`,
            image: `${API_BASE_URL}${item.image}`,
            timestamp: new Date(order.createdAt),
            // Thông tin đơn hàng
            orderId: order._id,
            orderStatus: order.status,
            orderTotal: order.total_amount,
            shipping: order.shipping,
            subTotal: order.sub_total_amount,
            // Thông tin sản phẩm
            productId: item.id_product,
            quantity: item.quantity,
            unitPrice: item.unit_price_item,
            totalPrice: item.total_price_item,
            size: item.size.trim(),
            category: item.cate_name,
            // Thông tin địa chỉ
            customerName: order.id_address.fullName,
            customerAddress: order.id_address.addressDetail,
            customerPhone: order.id_address.phone_number,
            // User info
            userId: order.userId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          });
        });
      });

      // Sắp xếp theo thời gian (mới nhất trước)
      const allNotifications = cartNotifications.sort(
        (a, b) => b.timestamp - a.timestamp,
      );

      setNotifications(allNotifications);
      console.log('✅ Total notifications created:', allNotifications.length);
    } catch (error) {
      console.error('❌ Lỗi khi lấy thông báo:', error);
      Alert.alert('Lỗi', 'Không thể tải thông báo');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatTime = timestamp => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return 'Vừa xong';
    }
    if (diffMins < 60) {
      return `${diffMins} phút trước`;
    }
    if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    }
    if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    }
    return time.toLocaleDateString('vi-VN');
  };

  const formatDateTime = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNotificationPress = item => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const copyToClipboard = (text, label) => {
    // In a real app, you would use Clipboard from '@react-native-clipboard/clipboard'
    console.log(`Copied ${label}:`, text);
    Alert.alert('✅ Đã sao chép', `${label} đã được sao chép!`);
  };

  const DetailModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <StatusBar
            backgroundColor="rgba(0,0,0,0.5)"
            barStyle="light-content"
          />
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>📦 Chi Tiết Đơn Hàng</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}>
              {/* Product Image & Name */}
              <View style={styles.productSection}>
                <Image
                  source={{uri: selectedItem.image}}
                  style={styles.modalProductImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>
                    {selectedItem.subtitle}
                  </Text>
                  <Text style={styles.productSize}>
                    Size: {selectedItem.size}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {selectedItem.orderStatus}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Order Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 Thông Tin Đơn Hàng</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Order ID:</Text>
                  <TouchableOpacity
                    style={styles.copyableText}
                    onPress={() =>
                      copyToClipboard(selectedItem.orderId, 'Order ID')
                    }>
                    <Text style={styles.infoValue}>{selectedItem.orderId}</Text>
                    <Text style={styles.copyIcon}>📋</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>User ID:</Text>
                  <TouchableOpacity
                    style={styles.copyableText}
                    onPress={() =>
                      copyToClipboard(selectedItem.userId, 'User ID')
                    }>
                    <Text style={styles.infoValue}>{selectedItem.userId}</Text>
                    <Text style={styles.copyIcon}>📋</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Ngày đặt:</Text>
                  <Text style={styles.infoValue}>
                    {formatDateTime(selectedItem.createdAt)}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Cập nhật:</Text>
                  <Text style={styles.infoValue}>
                    {formatDateTime(selectedItem.updatedAt)}
                  </Text>
                </View>
              </View>

              {/* Customer Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>👤 Thông Tin Khách Hàng</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Họ tên:</Text>
                  <Text style={styles.infoValue}>
                    {selectedItem.customerName}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Số điện thoại:</Text>
                  <TouchableOpacity
                    onPress={() =>
                      copyToClipboard(
                        selectedItem.customerPhone,
                        'Số điện thoại',
                      )
                    }>
                    <Text style={[styles.infoValue, styles.phoneNumber]}>
                      {selectedItem.customerPhone}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Địa chỉ:</Text>
                  <Text style={[styles.infoValue, styles.addressText]}>
                    {selectedItem.customerAddress}
                  </Text>
                </View>
              </View>

              {/* Product Details */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🛍️ Chi Tiết Sản Phẩm</Text>
                <View style={styles.productDetailCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tên sản phẩm:</Text>
                    <Text style={styles.infoValue}>
                      {selectedItem.subtitle}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Size:</Text>
                    <Text style={styles.infoValue}>{selectedItem.size}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Số lượng:</Text>
                    <Text style={styles.quantityValue}>
                      {selectedItem.quantity}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Đơn giá:</Text>
                    <Text style={styles.priceValue}>
                      {formatPrice(selectedItem.unitPrice)}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.totalLabel}>Thành tiền:</Text>
                    <Text style={styles.totalValue}>
                      {formatPrice(selectedItem.totalPrice)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Order Summary */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💰 Tổng Kết Đơn Hàng</Text>
                <View style={styles.summaryCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tạm tính:</Text>
                    <Text style={styles.infoValue}>
                      {formatPrice(selectedItem.subTotal)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phí vận chuyển:</Text>
                    <Text style={styles.infoValue}>
                      {formatPrice(selectedItem.shipping)}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.infoRow}>
                    <Text style={styles.grandTotalLabel}>Tổng cộng:</Text>
                    <Text style={styles.grandTotalValue}>
                      {formatPrice(selectedItem.orderTotal)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  copyToClipboard(selectedItem.orderId, 'Order ID')
                }>
                <Text style={styles.actionButtonText}>
                  📋 Sao chép Order ID
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={closeModal}>
                <Text style={styles.closeModalButtonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderNotificationItem = ({item}) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}>
      <Image
        source={{uri: item.image || 'https://via.placeholder.com/48'}}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.status}>📋 {item.orderStatus}</Text>
        <Text style={styles.orderId}>
          🆔 Order: ...{item.orderId.slice(-8)}
        </Text>
        <Text style={styles.customer}>👤 {item.customerName}</Text>
        <Text style={styles.timestamp}>⏰ {formatTime(item.timestamp)}</Text>
      </View>
      <View style={styles.rightInfo}>
        <Text style={styles.totalPrice}>{formatPrice(item.totalPrice)}</Text>
        <View style={[styles.indicator, {backgroundColor: '#FF9800'}]} />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>🔄 Đang tải thông báo...</Text>
        <Text style={styles.userIdText}>👤 User ID: {userId}</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>🔔 Thông báo</Text>
        <Text style={styles.userIdHeader}>👤 User: {userId}</Text>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
          <Text style={styles.emptySubtitle}>
            Bạn sẽ nhận được thông báo về các sản phẩm đã đặt tại đây
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔔 Thông báo</Text>
      <Text style={styles.userIdHeader}>👤 User: {userId}</Text>
      <Text style={styles.statsHeader}>
        📊 {notifications.length} sản phẩm từ{' '}
        {new Set(notifications.map(n => n.orderId)).size} đơn hàng
      </Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderNotificationItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
      <DetailModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  userIdHeader: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
    fontFamily: 'monospace',
  },
  statsHeader: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 15,
    color: '#888',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  userIdText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  rightInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#777',
    marginBottom: 3,
  },
  status: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
    marginBottom: 2,
  },
  orderId: {
    fontSize: 11,
    color: '#9C27B0',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  customer: {
    fontSize: 11,
    color: '#4CAF50',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.9,
    minHeight: height * 0.6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  productSection: {
    flexDirection: 'row',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalProductImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  copyableText: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  copyIcon: {
    marginLeft: 8,
    fontSize: 12,
  },
  phoneNumber: {
    color: '#2196F3',
    textDecorationLine: 'underline',
  },
  addressText: {
    textAlign: 'right',
    lineHeight: 18,
  },
  productDetailCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  quantityValue: {
    fontSize: 14,
    color: '#FF9800',
    fontWeight: 'bold',
    flex: 2,
    textAlign: 'right',
  },
  priceValue: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    flex: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
    flex: 2,
    textAlign: 'right',
  },
  summaryCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    flex: 2,
    textAlign: 'right',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeModalButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Notification;
