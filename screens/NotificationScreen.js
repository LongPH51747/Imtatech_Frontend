import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import {apiGetNotifications, apiMarkNotificationAsRead} from '../api';

const NotificationScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // API call để lấy thông báo thật - TEMPORARY: Mock data for testing
  const fetchNotifications = async () => {
    const userId = user?._id || user?.id;
    
    if (!userId) {
      console.log('User object trong NotificationScreen:', user);
      setNotifications([]);
      return;
    }

    try {
      setLoading(true);
      console.log('🔔 Fetching notifications for user ID:', userId);
      
      // Try real API first
      try {
        const response = await apiGetNotifications(userId);
        console.log('✅ Real API response:', response);
        setNotifications(response.data || []);
        return;
      } catch (apiError) {
        console.log('⚠️ Real API not ready, using mock data');
        
        // Mock notifications for testing
        const mockNotifications = [
          {
            id: '1',
            title: 'Đặt hàng thành công',
            message: 'Đơn hàng của bạn đã được xác nhận và đang được xử lý.',
            time: 'Thứ hai, 15/01/2024',
            type: 'order',
            read: false,
            hasProduct: true,
            productImage: 'https://images.unsplash.com/photo-1463438690606-f6778b8c1d10?w=400',
            productId: '12345',
          },
          {
            id: '2',
            title: 'Khuyến mãi đặc biệt',
            message: 'Giảm giá 20% cho tất cả sản phẩm cây cảnh. Áp dụng đến hết tháng.',
            time: '1 ngày trước',
            type: 'promotion',
            read: true,
            hasProduct: false,
          },
          {
            id: '3',
            title: 'Đơn hàng đã giao thành công',
            message: 'Cảm ơn bạn đã mua hàng. Hãy đánh giá sản phẩm để giúp chúng tôi cải thiện.',
            time: '2 ngày trước',
            type: 'delivery',
            read: true,
            hasProduct: false,
          },
        ];
        
        setNotifications(mockNotifications);
        console.log('📱 Using mock notifications:', mockNotifications.length);
      }
    } catch (error) {
      console.error('❌ Error in fetchNotifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    fetchNotifications();
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadNotifications();
      setRefreshing(false);
    }, 1000);
  };

  const markAsRead = async (id) => {
    try {
      // Cập nhật UI ngay lập tức
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      
      // Gọi API để cập nhật trên server
      await apiMarkNotificationAsRead(id);
    } catch (error) {
      console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
      // Có thể rollback UI state nếu API call thất bại
    }
  };

  const handleNotificationPress = (notification) => {
    markAsRead(notification.id);
    
    // Nếu có thông tin sản phẩm, chuyển đến trang chi tiết sản phẩm
    if (notification.hasProduct && notification.productId) {
      navigation.navigate('ProductDetail', { productId: notification.productId });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'promotion':
        return '🎉';
      case 'delivery':
        return '🚚';
      default:
        return '📢';
    }
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadItem]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTime}>{item.time}</Text>
        
        {item.hasProduct ? (
          // Layout cho thông báo có sản phẩm
          <View style={styles.productNotificationContainer}>
            <View style={styles.productInfo}>
              <Image
                source={{ uri: item.productImage }}
                style={styles.productImage}
              />
              <View style={styles.productDetails}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.productMessage}>{item.message}</Text>
              </View>
            </View>
          </View>
        ) : (
          // Layout cho thông báo thông thường
          <View style={styles.regularNotificationContainer}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationIcon}>
                {getNotificationIcon(item.type)}
              </Text>
              <View style={styles.notificationTextContainer}>
                <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
                  {item.title}
                </Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage}>{item.message}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Đang tải thông báo...</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Hiện chưa có thông báo nào cho bạn</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 16,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  unreadItem: {
    backgroundColor: '#fff',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  // Styles cho thông báo có sản phẩm
  productNotificationContainer: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
  },
  productMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  // Styles cho thông báo thông thường
  regularNotificationContainer: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unreadTitle: {
    color: '#007AFF',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 32,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
});

export default NotificationScreen; 