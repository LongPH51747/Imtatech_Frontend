import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
} from 'react-native';

const TransactionHistory = ({navigation, route}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get userId from route params or use default
  const userId = route?.params?.userId || '68633e54628e8c899e05f51b';

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from API
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      setTransactions([
        {
          id: '12345',
          status: 'Hoàn thành',
          date: '15/01/2025 - 14:30',
          amount: 450000,
          items: ['Cây Sen Đá', 'Chậu Gốm Sứ'],
        },
        {
          id: '12344',
          status: 'Đang giao',
          date: '10/01/2025 - 09:15',
          amount: 320000,
          items: ['Cây Lưỡi Hổ', 'Phân Bón'],
        },
        {
          id: '12343',
          status: 'Đã hủy',
          date: '05/01/2025 - 16:45',
          amount: 200000,
          items: ['Cây Cảnh Mini'],
        },
        {
          id: '12342',
          status: 'Hoàn thành',
          date: '01/01/2025 - 10:30',
          amount: 180000,
          items: ['Cây Đuôi Công', 'Giá Đỡ Cây'],
        },
      ]);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      Alert.alert('Lỗi', 'Không thể tải lịch sử giao dịch');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const formatPrice = price => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Hoàn thành':
        return '#4CAF50';
      case 'Đang giao':
        return '#2196F3';
      case 'Đã hủy':
        return '#f44336';
      default:
        return '#666';
    }
  };

  const handleTransactionPress = transaction => {
    Alert.alert(
      'Chi tiết đơn hàng',
      `Đơn hàng: #${transaction.id}\nTrạng thái: ${
        transaction.status
      }\nSản phẩm: ${transaction.items.join(', ')}\nTổng tiền: ${formatPrice(
        transaction.amount,
      )}`,
      [{text: 'OK', style: 'default'}],
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Lịch sử giao dịch</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải giao dịch...</Text>
          <Text style={styles.userIdText}>👤 User ID: {userId}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.pageHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Lịch sử giao dịch</Text>
      </View>

      {/* User Info */}
      <View style={styles.userInfoHeader}>
        <Text style={styles.userInfoText}>👤 User ID: {userId}</Text>
        <Text style={styles.transactionCount}>
          📊 {transactions.length} giao dịch
        </Text>
      </View>

      <ScrollView
        style={styles.transactionContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>Chưa có giao dịch nào</Text>
            <Text style={styles.emptySubtitle}>
              Lịch sử giao dịch của bạn sẽ hiển thị ở đây
            </Text>
          </View>
        ) : (
          transactions.map(transaction => (
            <TouchableOpacity
              key={transaction.id}
              style={styles.transactionCard}
              onPress={() => handleTransactionPress(transaction)}>
              <View style={styles.transactionHeader}>
                <Text style={styles.transactionId}>
                  🛒 Đơn hàng #{transaction.id}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${getStatusColor(
                        transaction.status,
                      )}20`,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.transactionStatus,
                      {color: getStatusColor(transaction.status)},
                    ]}>
                    {transaction.status}
                  </Text>
                </View>
              </View>

              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDate}>
                  📅 {transaction.date}
                </Text>
                <Text style={styles.transactionItems}>
                  📦 {transaction.items.join(', ')}
                </Text>
                <Text style={styles.transactionAmount}>
                  💰 {formatPrice(transaction.amount)}
                </Text>
              </View>

              <View style={styles.transactionFooter}>
                <Text style={styles.viewDetailsText}>Xem chi tiết →</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  userIdText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
    fontWeight: '300',
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  userInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfoText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  transactionCount: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  transactionContent: {
    flex: 1,
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
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
  transactionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionDetails: {
    marginBottom: 15,
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  transactionItems: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff6b35',
  },
  transactionFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default TransactionHistory;
