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
import {useAuth} from '../context/AuthContext';
import {apiGetProfile, apiUpdateProfile, apiChangePassword} from '../api';

const EditUser = ({navigation}) => {
  const {user, token, logout} = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user && token) {
      fetchUserProfile();
    }
  }, [user, token]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      console.log('📱 Fetching user profile with token...');
      
      const response = await apiGetProfile(token);
      console.log('✅ User profile response:', response.data);
      
      const userData = response.data;
      setUserProfile(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      
      // Fallback to user from AuthContext
      if (user) {
        console.log('📱 Using fallback user data from AuthContext');
        setUserProfile(user);
        setFormData({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
        });
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng');
      }
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

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ tên và email');
      return;
    }

    try {
      setSaving(true);
      console.log('💾 Saving profile data:', formData);
      
      const response = await apiUpdateProfile(formData, token);
      console.log('✅ Profile update response:', response);
      
      // Update local state
      setUserProfile(prev => ({
        ...prev,
        ...formData,
        updatedAt: new Date().toISOString(),
      }));

      Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
    } catch (error) {
      console.error('❌ Error saving profile:', error);
      Alert.alert('Lỗi', error.message || 'Không thể lưu thông tin. Vui lòng thử lại!');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin mật khẩu');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setSaving(true);
      console.log('🔐 Changing password...');
      
      const changePasswordPayload = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
      
      await apiChangePassword(changePasswordPayload, token);
      console.log('✅ Password changed successfully');
      
      Alert.alert(
        'Thành công',
        'Mật khẩu đã được thay đổi! Vui lòng đăng nhập lại.',
        [
          {
            text: 'OK',
            onPress: () => {
              logout();
              navigation.replace('Login');
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error changing password:', error);
      Alert.alert('Lỗi', error.message || 'Không thể đổi mật khẩu. Vui lòng thử lại!');
    } finally {
      setSaving(false);
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setShowPasswordForm(false);
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
              uri: userProfile?.avatar || user?.avatar || 'https://via.placeholder.com/100',
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
            <Text style={styles.infoValue}>{userProfile?._id || user?._id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vai trò:</Text>
            <Text style={styles.infoValue}>{userProfile?.role || user?.role || 'user'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Trạng thái:</Text>
            <Text
              style={[
                styles.infoValue,
                {color: (userProfile?.is_allowed ?? user?.is_allowed ?? true) ? '#4CAF50' : '#f44336'},
              ]}>
              {(userProfile?.is_allowed ?? user?.is_allowed ?? true) ? 'Hoạt động' : 'Bị khóa'}
            </Text>
          </View>
        </View>

        {/* Edit Profile Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Chỉnh sửa thông tin cá nhân</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Tên người dùng *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={value => handleInputChange('name', value)}
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

          <TouchableOpacity 
            style={[styles.saveButton, saving && styles.disabledButton]} 
            onPress={handleSaveProfile}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Password Section */}
        <View style={styles.formCard}>
          <View style={styles.passwordHeader}>
            <Text style={styles.formTitle}>Bảo mật tài khoản</Text>
            <TouchableOpacity
              style={styles.togglePasswordBtn}
              onPress={() => setShowPasswordForm(!showPasswordForm)}>
              <Text style={styles.togglePasswordText}>
                {showPasswordForm ? '✕ Hủy' : '🔐 Đổi mật khẩu'}
              </Text>
            </TouchableOpacity>
          </View>

          {showPasswordForm && (
            <>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Mật khẩu hiện tại *</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.currentPassword}
                  onChangeText={value => handlePasswordChange('currentPassword', value)}
                  placeholder="Nhập mật khẩu hiện tại"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Mật khẩu mới *</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.newPassword}
                  onChangeText={value => handlePasswordChange('newPassword', value)}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Xác nhận mật khẩu mới *</Text>
                <TextInput
                  style={styles.input}
                  value={passwordData.confirmPassword}
                  onChangeText={value => handlePasswordChange('confirmPassword', value)}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              <View style={styles.passwordActions}>
                <TouchableOpacity
                  style={styles.cancelPasswordBtn}
                  onPress={resetPasswordForm}>
                  <Text style={styles.cancelPasswordText}>Hủy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.changePasswordBtn, saving && styles.disabledButton]}
                  onPress={handleChangePassword}
                  disabled={saving}>
                  <Text style={styles.changePasswordText}>
                    {saving ? '⏳ Đang đổi...' : '🔐 Đổi mật khẩu'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        {/* Timestamps */}
        {userProfile && (
          <View style={styles.timestampCard}>
            <Text style={styles.timestampTitle}>Thông tin thời gian</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tạo lúc:</Text>
              <Text style={styles.infoValue}>
                {new Date(userProfile.createdAt || user?.createdAt).toLocaleString('vi-VN')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Cập nhật:</Text>
              <Text style={styles.infoValue}>
                {new Date(userProfile.updatedAt || user?.updatedAt).toLocaleString('vi-VN')}
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
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  togglePasswordBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  togglePasswordText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
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
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelPasswordBtn: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelPasswordText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  changePasswordBtn: {
    flex: 1,
    backgroundColor: '#dc3545',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  changePasswordText: {
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