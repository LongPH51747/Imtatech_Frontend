import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {ADDRESS_GET_API} from '../config/api';

const Address = ({navigation, route}) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get userId from route params or use default
  const userId = route?.params?.userId || '68633e54628e8c899e05f51b';

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching addresses for userId:', userId);

      const response = await fetch(`${ADDRESS_GET_API}?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const addressData = await response.json();
        console.log('📍 Addresses fetched:', addressData);

        // Filter addresses by userId if needed
        const userAddresses = Array.isArray(addressData)
          ? addressData.filter(addr => addr.userId === userId)
          : [];

        setAddresses(userAddresses);
      } else {
        throw new Error('API response not ok');
      }
    } catch (error) {
      console.error('❌ Error fetching addresses:', error);

      // Fallback data based on userId
      setAddresses([
        {
          _id: '68687cd694e8b0e8a01165f6',
          userId: userId || '68633e54628e8c899e05f51b',
          fullName: 'Phạm Trọng Nam',
          addressDetail: '143 LÊ Xá Lê Thanh Mỹ Đức Hà Nội',
          phone_number: '0964941802',
          is_default: true,
          __v: 0,
        },
        {
          _id: '68687cd694e8b0e8a01165f7',
          userId: userId || '68633e54628e8c899e05f51b',
          fullName: 'Nguyễn Văn A',
          addressDetail: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
          phone_number: '0123456789',
          is_default: false,
          __v: 0,
        },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAddresses();
  };

  const handleAddAddress = () => {
    Alert.alert(
      'Thêm địa chỉ mới',
      'Tính năng thêm địa chỉ đang được phát triển.\nSẽ có form nhập thông tin địa chỉ mới.',
      [{text: 'OK', style: 'default'}],
    );
  };

  const handleEditAddress = address => {
    Alert.alert(
      'Chỉnh sửa địa chỉ',
      `Chỉnh sửa địa chỉ: ${address.fullName}\n${address.addressDetail}`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Chỉnh sửa',
          onPress: () => {
            console.log('Edit address:', address._id);
            // In a real app, this would navigate to edit form
          },
        },
      ],
    );
  };

  const handleDeleteAddress = (addressId, addressName) => {
    Alert.alert(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa địa chỉ "${addressName}"?`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => {
            console.log('Delete address:', addressId);
            // Remove from local state
            setAddresses(prev => prev.filter(addr => addr._id !== addressId));
            Alert.alert('Thành công', 'Địa chỉ đã được xóa!');
          },
        },
      ],
    );
  };

  const handleSetDefault = (addressId, addressName) => {
    Alert.alert(
      'Đặt làm địa chỉ mặc định',
      `Đặt "${addressName}" làm địa chỉ mặc định?`,
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Đặt mặc định',
          onPress: () => {
            console.log('Set default address:', addressId);
            // Update local state
            setAddresses(prev =>
              prev.map(addr => ({
                ...addr,
                is_default: addr._id === addressId,
              })),
            );
            Alert.alert('Thành công', 'Đã đặt làm địa chỉ mặc định!');
          },
        },
      ],
    );
  };

  if (loading && addresses.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Địa chỉ giao hàng</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải địa chỉ...</Text>
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
        <Text style={styles.pageTitle}>Địa chỉ giao hàng</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <Text style={styles.addButtonText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfoHeader}>
        <Text style={styles.userInfoText}>👤 User ID: {userId}</Text>
        <Text style={styles.addressCount}>📍 {addresses.length} địa chỉ</Text>
      </View>

      <ScrollView
        style={styles.addressContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <View style={styles.emptyAddressContainer}>
            <Text style={styles.emptyAddressIcon}>📍</Text>
            <Text style={styles.emptyAddressTitle}>Chưa có địa chỉ nào</Text>
            <Text style={styles.emptyAddressSubtitle}>
              Thêm địa chỉ để thuận tiện cho việc giao hàng
            </Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={handleAddAddress}>
              <Text style={styles.addFirstButtonText}>
                + Thêm địa chỉ đầu tiên
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          addresses.map((address, index) => (
            <View key={address._id} style={styles.addressCard}>
              {/* Card Header */}
              <View style={styles.addressHeader}>
                <View style={styles.addressInfo}>
                  <Text style={styles.addressName}>{address.fullName}</Text>
                  {address.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Mặc định</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditAddress(address)}>
                  <Text style={styles.editButtonText}>✏️ Sửa</Text>
                </TouchableOpacity>
              </View>

              {/* Address Details */}
              <View style={styles.addressDetails}>
                <View style={styles.addressRow}>
                  <Text style={styles.addressLabel}>📞 Số điện thoại:</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert('Gọi điện', address.phone_number)
                    }>
                    <Text style={[styles.addressValue, styles.phoneValue]}>
                      {address.phone_number}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.addressRow}>
                  <Text style={styles.addressLabel}>📍 Địa chỉ:</Text>
                  <Text style={[styles.addressValue, styles.addressText]}>
                    {address.addressDetail}
                  </Text>
                </View>

                <View style={styles.addressRow}>
                  <Text style={styles.addressLabel}>🆔 ID:</Text>
                  <Text style={[styles.addressValue, styles.idText]}>
                    {address._id}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.addressActions}>
                {!address.is_default ? (
                  <TouchableOpacity
                    style={styles.setDefaultButton}
                    onPress={() =>
                      handleSetDefault(address._id, address.fullName)
                    }>
                    <Text style={styles.setDefaultText}>
                      ⭐ Đặt làm mặc định
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.defaultIndicator}>
                    <Text style={styles.defaultIndicatorText}>
                      ✅ Địa chỉ mặc định
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() =>
                    handleDeleteAddress(address._id, address.fullName)
                  }>
                  <Text style={styles.deleteButtonText}>🗑️ Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    justifyContent: 'space-between',
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
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
  addressCount: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  addressContent: {
    flex: 1,
    padding: 20,
  },
  emptyAddressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyAddressIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyAddressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyAddressSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  addressCard: {
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
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addressDetails: {
    marginBottom: 15,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingVertical: 4,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
    fontWeight: '500',
  },
  addressValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  phoneValue: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  addressText: {
    lineHeight: 20,
  },
  idText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  setDefaultButton: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    marginRight: 10,
  },
  setDefaultText: {
    color: '#007AFF',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  defaultIndicator: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    marginRight: 10,
  },
  defaultIndicatorText: {
    color: '#4CAF50',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 13,
    fontWeight: '500',
  },
});

export default Address;
