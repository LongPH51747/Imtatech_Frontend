import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {USER_PROFILE_API} from '../config/api';

const Profile = ({navigation}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Sample user ID - in real app this would come from authentication
  const userId = '68633e54628e8c899e05f51b';

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
        console.log('👤 User profile fetched:', userData);
        setUserProfile(userData);
      } else {
        throw new Error('API response not ok');
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      // Fallback to mock data if API fails
      setUserProfile({
        _id: userId,
        username: 'nguyenvana',
        email: 'nguyenvana@gmail.com',
        password: 'hashed_password',
        role: 'user',
        avatar: 'https://via.placeholder.com/80',
        is_allowed: true,
        createdAt: '2025-07-06T11:16:37.463Z',
        updatedAt: '2025-07-06T11:16:37.463Z',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserProfile();
  };

  const handleMenuPress = menuItem => {
    switch (menuItem) {
      case 'address':
        navigation.navigate('Address', {userId});
        break;
      case 'edit':
        navigation.navigate('EditUser', {userId});
        break;
      case 'guide':
        navigation.navigate('PlantGuide');
        break;
      case 'history':
        navigation.navigate('TransactionHistory', {userId});
        break;
      case 'terms':
        Alert.alert(
          'Thông báo',
          'Trang Điều khoản và điều kiện đang được phát triển',
        );
        break;
      case 'privacy':
        Alert.alert(
          'Thông báo',
          'Trang Chính sách quyền riêng tư đang được phát triển',
        );
        break;
      case 'chat':
        Alert.alert('Thông báo', 'Tính năng Chat đang được phát triển');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => {
          // Handle logout logic here
          console.log('User logged out');
        },
      },
    ]);
  };

  const MenuItem = ({
    title,
    onPress,
    isLogout = false,
    isHeader = false,
    isClickable = true,
  }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isLogout && styles.logoutItem,
        isHeader && styles.headerItem,
        !isClickable && styles.nonClickableItem,
      ]}
      onPress={isClickable ? onPress : null}
      disabled={!isClickable}>
      <Text
        style={[
          styles.menuText,
          isLogout && styles.logoutText,
          isHeader && styles.headerText,
        ]}>
        {title}
      </Text>
      {isClickable && !isHeader && !isLogout && (
        <Text style={styles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  if (loading && !userProfile) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Text style={styles.loadingText}>Đang tải thông tin profile...</Text>
        <Text style={styles.userIdText}>👤 User ID: {userId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PROFILE</Text>
        </View>

        {/* User Info Section */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: userProfile?.avatar || 'https://via.placeholder.com/80',
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>
            {userProfile?.username || 'Người dùng'}
          </Text>
          <Text style={styles.userEmail}>
            {userProfile?.email || 'email@example.com'}
          </Text>
          <Text style={styles.userId}>🆔 {userProfile?._id || userId}</Text>
        </View>

        {/* Menu Section 1 */}
        <View style={styles.menuSection}>
          <MenuItem title="Chung" isHeader={true} isClickable={false} />
          <MenuItem
            title="Địa chỉ"
            onPress={() => handleMenuPress('address')}
          />
          <MenuItem
            title="Chỉnh sửa thông tin"
            onPress={() => handleMenuPress('edit')}
          />
          <MenuItem
            title="Cẩm nang trồng cây"
            onPress={() => handleMenuPress('guide')}
          />
          <MenuItem
            title="Lịch sử giao dịch"
            onPress={() => handleMenuPress('history')}
          />
          <MenuItem title="Chat" onPress={() => handleMenuPress('chat')} />
        </View>

        {/* Menu Section 2 */}
        <View style={styles.menuSection}>
          <MenuItem
            title="Bảo mật và Điều khoản"
            isHeader={true}
            isClickable={false}
          />
          <MenuItem
            title="Điều khoản và điều kiện"
            onPress={() => handleMenuPress('terms')}
          />
          <MenuItem
            title="Chính sách quyền riêng tư"
            onPress={() => handleMenuPress('privacy')}
          />
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <MenuItem title="Đăng xuất" onPress={handleLogout} isLogout={true} />
        </View>

        {/* User Info Debug (can be removed in production) */}
        {__DEV__ && userProfile && (
          <View style={styles.debugSection}>
            <Text style={styles.debugTitle}>Debug Info:</Text>
            <Text style={styles.debugText}>ID: {userProfile._id}</Text>
            <Text style={styles.debugText}>Role: {userProfile.role}</Text>
            <Text style={styles.debugText}>
              Status: {userProfile.is_allowed ? 'Allowed' : 'Blocked'}
            </Text>
            <Text style={styles.debugText}>
              Created:{' '}
              {new Date(userProfile.createdAt).toLocaleDateString('vi-VN')}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 1,
  },
  userSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  userId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  menuSection: {
    backgroundColor: '#fff',
    marginTop: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  headerItem: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: -20,
    paddingHorizontal: 25,
  },
  nonClickableItem: {
    opacity: 1,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  headerText: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: '300',
  },
  logoutSection: {
    backgroundColor: '#fff',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#ff4444',
    fontWeight: '500',
  },
  debugSection: {
    backgroundColor: '#f8f9fa',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});

export default Profile;
