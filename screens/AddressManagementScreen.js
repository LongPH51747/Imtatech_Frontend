import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useAuth} from '../context/AuthContext';
import {
  apiGetAddressesByUser,
  apiCreateAddress,
  apiUpdateAddress,
  apiDeleteAddress,
} from '../api';

const AddressManagementScreen = ({navigation}) => {
  const {user} = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const userId = user?._id || user?.id;
    
    if (!userId) {
      console.log('User object:', user);
      console.error('Không tìm thấy user ID');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Loading addresses for user ID:', userId);
      const response = await apiGetAddressesByUser(userId);
      console.log('API Response for addresses:', response);
      console.log('Addresses data:', response.data);
      
      const rawAddresses = response.data || [];
      
      // Map API response fields to frontend fields
      const mappedAddresses = rawAddresses.map(apiAddress => ({
        id: apiAddress._id || apiAddress.id,
        name: apiAddress.fullName || apiAddress.name,
        phone: apiAddress.phone_number || apiAddress.phone,
        address: apiAddress.addressDetail || apiAddress.address,
        isDefault: apiAddress.is_default || apiAddress.isDefault,
        // Keep original API data for reference
        _originalApiData: apiAddress
      }));
      
      setAddresses(mappedAddresses);
      
      console.log('📍 Danh sách địa chỉ người dùng:');
      console.log('Raw API addresses:', rawAddresses);
      console.log('Mapped addresses:', mappedAddresses);
      console.log('Total addresses:', mappedAddresses.length);
      mappedAddresses.forEach((address, index) => {
        console.log(`Địa chỉ ${index + 1}:`, {
          id: address.id,
          name: address.name,
          phone: address.phone,
          address: address.address,
          isDefault: address.isDefault
        });
      });
    } catch (error) {
      console.error('❌ Load addresses error:', error);
      console.error('Error details:', error.message);
      Alert.alert('Lỗi', 'Không thể tải danh sách địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadAddresses().then(() => setRefreshing(false));
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setNewAddress({
      name: '',
      phone: '',
      address: '',
      isDefault: false,
    });
    setModalVisible(true);
  };

  const handleEditAddress = (address) => {
    console.log('📝 Editing address:', address);
    setEditingAddress(address);
    setNewAddress({
      name: address.name,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault,
    });
    console.log('📝 Edit form data:', {
      name: address.name,
      phone: address.phone,
      address: address.address,
      isDefault: address.isDefault,
    });
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.address) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    const userId = user?._id || user?.id;
    
    if (!userId) {
      console.log('User object trong handleSaveAddress:', user);
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    console.log('Saving address for user ID:', userId);

    try {
      setLoading(true);
      
      if (editingAddress) {
        // Cập nhật địa chỉ
        console.log('✏️ Updating address ID:', editingAddress.id);
        console.log('Updated address data:', newAddress);
        
        // Map frontend fields to API fields
        const apiData = {
          fullName: newAddress.name,
          phone_number: newAddress.phone,
          addressDetail: newAddress.address,
          is_default: newAddress.isDefault
        };
        console.log('Update API data to send:', apiData);
        
        await apiUpdateAddress(editingAddress.id, apiData);
        console.log('✅ Update address API success');
        
        setAddresses(prev => {
          const updated = prev.map(addr => {
            if (addr.id === editingAddress.id) {
              return {
                ...addr,
                name: newAddress.name,
                phone: newAddress.phone,
                address: newAddress.address,
                isDefault: newAddress.isDefault
              };
            }
            return addr;
          });
          console.log('📍 Updated addresses list after edit:', updated);
          return updated;
        });
        Alert.alert('Thành công', 'Cập nhật địa chỉ thành công');
      } else {
        // Tạo địa chỉ mới
        console.log('📍 Creating new address for user:', userId);
        console.log('New address data:', newAddress);
        
        // Map frontend fields to API fields
        const apiData = {
          fullName: newAddress.name,
          phone_number: newAddress.phone,
          addressDetail: newAddress.address,
          is_default: newAddress.isDefault
        };
        console.log('API data to send:', apiData);
        
        const response = await apiCreateAddress(userId, apiData);
        console.log('✅ Create address API response:', response);
        
        // Map API response fields to frontend fields
        const apiAddress = response.data || response;
        const newAddr = {
          id: apiAddress._id || apiAddress.id || Date.now().toString(),
          name: apiAddress.fullName || apiAddress.name || newAddress.name,
          phone: apiAddress.phone_number || apiAddress.phone || newAddress.phone,
          address: apiAddress.addressDetail || apiAddress.address || newAddress.address,
          isDefault: apiAddress.is_default || apiAddress.isDefault || newAddress.isDefault,
          // Keep original API data for reference
          _originalApiData: apiAddress
        };
        console.log('➕ Mapped new address:', newAddr);
        
        setAddresses(prev => {
          const updated = [...prev, newAddr];
          console.log('📍 Updated addresses list:', updated);
          return updated;
        });
        Alert.alert('Thành công', 'Thêm địa chỉ thành công');
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Lỗi khi lưu địa chỉ:', error);
      Alert.alert('Lỗi', error.message || 'Không thể lưu địa chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (address) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa địa chỉ này?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('🗑️ Deleting address:', address);
              await apiDeleteAddress(address.id);
              console.log('✅ Delete address API success');
              
              setAddresses(prev => {
                const updated = prev.filter(addr => addr.id !== address.id);
                console.log('📍 Updated addresses list after delete:', updated);
                return updated;
              });
              Alert.alert('Thành công', 'Đã xóa địa chỉ');
            } catch (error) {
              console.error('❌ Lỗi khi xóa địa chỉ:', error);
              console.error('Delete error details:', error.message);
              Alert.alert('Lỗi', error.message || 'Không thể xóa địa chỉ');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleSetDefault = async (address) => {
    try {
      setLoading(true);
      // API để đặt địa chỉ mặc định - backend cần implement
      const updateData = {
        fullName: address.name,
        phone_number: address.phone,
        addressDetail: address.address,
        is_default: true
      };
      console.log('Set default API data:', updateData);
      await apiUpdateAddress(address.id, updateData);
      
      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === address.id,
        }))
      );
      Alert.alert('Thành công', 'Đã cập nhật địa chỉ mặc định');
    } catch (error) {
      console.error('Lỗi khi đặt địa chỉ mặc định:', error);
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật địa chỉ mặc định');
    } finally {
      setLoading(false);
    }
  };

  const renderAddress = ({item}) => (
    <View style={styles.addressItem}>
      <View style={styles.addressHeader}>
        <Text style={styles.addressName}>{item.name}</Text>
        {item.isDefault && <Text style={styles.defaultLabel}>Mặc định</Text>}
      </View>
      <Text style={styles.addressPhone}>{item.phone}</Text>
      <Text style={styles.addressText}>{item.address}</Text>
      
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditAddress(item)}
        >
          <Text style={styles.actionButtonText}>Sửa</Text>
        </TouchableOpacity>
        
        {!item.isDefault && (
          <TouchableOpacity
            style={[styles.actionButton, styles.defaultButton]}
            onPress={() => handleSetDefault(item)}
          >
            <Text style={styles.actionButtonText}>Đặt làm mặc định</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAddress(item)}
        >
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Quản lý địa chỉ</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddAddress}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddAddress}>
              <Text style={styles.emptyButtonText}>Thêm địa chỉ đầu tiên</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal thêm/sửa địa chỉ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={newAddress.name}
              onChangeText={(text) => setNewAddress(prev => ({...prev, name: text}))}
            />

            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={newAddress.phone}
              onChangeText={(text) => setNewAddress(prev => ({...prev, phone: text}))}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Địa chỉ chi tiết"
              value={newAddress.address}
              onChangeText={(text) => setNewAddress(prev => ({...prev, address: text}))}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, loading && styles.buttonDisabled]}
                onPress={handleSaveAddress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Lưu</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  addressItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  defaultLabel: {
    backgroundColor: '#007AFF',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  defaultButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  emptyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default AddressManagementScreen; 