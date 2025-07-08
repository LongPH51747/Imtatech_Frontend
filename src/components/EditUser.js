import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  TextInput,
} from 'react-native';
import {USER_PROFILE_API} from '../config/api';

const EditUser = ({navigation, route}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    address: '',
  });

  // Get userId from route params or use default
  const userId = route?.params?.userId || '68633e54628e8c899e05f51b';

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${USER_PROFILE_API}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('👤 User profile fetched for edit:', userData);
        setUserProfile(userData);
        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
        });
      } else {
        throw new Error('API response not ok');
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      // Fallback data
      const fallbackData = {
        _id: userId || '60f7c0b8e1b1c8a1b8e1b1c8',
        username: 'nguyenvana',
        email: 'nguyenvana@gmail.com',
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam',
        role: 'user',
        avatar: 'https://via.placeholder.com/100',
        is_allowed: true,
        createdAt: '2025-07-06T11:16:37.463Z',
        updatedAt: '2025-07-06T11:16:37.463Z',
      };
      setUserProfile(fallbackData);
      setFormData({
        username: fallbackData.username,
        email: fallbackData.email,
        phone: fallbackData.phone || '',
        address: fallbackData.address || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn lưu thay đổi?', [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Lưu',
          onPress: async () => {
            // In a real app, this would make an API call to update user info
            console.log('Saving user data:', {
              userId: userProfile?._id || userId,
              ...formData,
            });

            // Simulate API call
            Alert.alert('Thành công', 'Thông tin đã được cập nhật!');

            // Update local state
            setUserProfile(prev => ({
              ...prev,
              username: formData.username,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              updatedAt: new Date().toISOString(),
            }));
          },
        },
      ]);
    } catch (error) {
      console.error('❌ Error saving user profile:', error);
      Alert.alert('Lỗi', 'Không thể lưu thông tin. Vui lòng thử lại!');
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert('Thông báo', 'Tính năng đổi ảnh đại diện đang được phát triển');
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
          <Text style={styles.pageTitle}>Chỉnh sửa thông tin</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
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
        <Text style={styles.pageTitle}>Chỉnh sửa thông tin</Text>
      </View>

      <ScrollView style={styles.editForm} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarEditSection}>
          <Image
            source={{
              uri: userProfile?.avatar || 'https://via.placeholder.com/100',
            }}
            style={styles.editAvatar}
          />
          <TouchableOpacity
            style={styles.changeAvatarBtn}
            onPress={handleChangeAvatar}>
            <Text style={styles.changeAvatarText}>Đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfoCard}>
          <Text style={styles.userInfoTitle}>Thông tin tài khoản</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{userProfile?._id || userId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vai trò:</Text>
            <Text style={styles.infoValue}>{userProfile?.role || 'user'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text
              style={[
                styles.infoValue,
                {color: userProfile?.is_allowed ? '#4CAF50' : '#f44336'},
              ]}>
              {userProfile?.is_allowed ? 'Hoạt động' : 'Bị khóa'}
            </Text>
          </View>
        </View>

        {/* Edit Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Chỉnh sửa thông tin</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên người dùng *</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={value => handleInputChange('username', value)}
              placeholder="Nhập tên người dùng"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={value => handleInputChange('email', value)}
              placeholder="Nhập email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={value => handleInputChange('phone', value)}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={value => handleInputChange('address', value)}
              placeholder="Nhập địa chỉ"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>💾 Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>

        {/* Timestamps */}
        {userProfile && (
          <View style={styles.timestampCard}>
            <Text style={styles.timestampTitle}>Thông tin thời gian</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tạo lúc:</Text>
              <Text style={styles.infoValue}>
                {new Date(userProfile.createdAt).toLocaleString('vi-VN')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cập nhật:</Text>
              <Text style={styles.infoValue}>
                {new Date(userProfile.updatedAt).toLocaleString('vi-VN')}
              </Text>
            </View>
          </View>
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
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  editForm: {
    flex: 1,
    padding: 20,
  },
  avatarEditSection: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
  },
  changeAvatarBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#007AFF',
    borderRadius: 25,
  },
  changeAvatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  userInfoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  formCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#007AFF',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  timestampCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timestampTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
});

export default EditUser;
