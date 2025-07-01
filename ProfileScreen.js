import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button, Image, Modal, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGetProfile, apiChangePassword, apiUpdateProfile } from './api';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import { BASE_URL } from './api';

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingChange, setLoadingChange] = useState(false);
  const [editName, setEditName] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token from AsyncStorage:', token);
      if (!token) {
        Alert.alert('Lỗi', 'Bạn cần đăng nhập');
        navigation.replace('Login');
        return;
      }
      const res = await apiGetProfile(token);
      console.log('Profile API response:', res.data);
      setProfile(res.data);
    } catch (error) {
      console.log('Error fetching profile:', error, error?.response?.data);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể lấy thông tin cá nhân');
      navigation.replace('Login');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchProfile();
    }, [])
  );

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải từ 6 ký tự trở lên');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
      return;
    }
    setLoadingChange(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await apiChangePassword(token, oldPassword, newPassword);
      setShowChangePassword(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Thành công', 'Đổi mật khẩu thành công!');
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoadingChange(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await apiUpdateProfile(token, { name: editName });
      setShowEditModal(false);
      fetchProfile(); // reload lại profile
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Không có thông tin cá nhân</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={profile.avatar ? { uri: profile.avatar } : require('./img/avata.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Vai trò: <Text style={styles.value}>{profile.role}</Text></Text>
        <Text style={styles.label}>Trạng thái: <Text style={styles.value}>{profile.is_allowed ? 'Được phép' : 'Bị khoá'}</Text></Text>
        <Text style={styles.label}>Ngày tạo: <Text style={styles.value}>{new Date(profile.createdAt).toLocaleString()}</Text></Text>
      </View>
      <Button title="Đổi mật khẩu" onPress={() => setShowChangePassword(true)} />
      <View style={{ height: 12 }} />
      <Button title="Đăng xuất" color="#ff3b30" onPress={async () => {
        await AsyncStorage.removeItem('token');
        navigation.replace('Login');
      }} />
      <Button title="Cập nhật tên" onPress={() => { setEditName(profile.name); setShowEditModal(true); }} />
      {/* Modal đổi mật khẩu */}
      <Modal
        visible={showChangePassword}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Đổi mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu cũ"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
            <TouchableOpacity
              style={[styles.button, loadingChange && styles.buttonDisabled]}
              onPress={handleChangePassword}
              disabled={loadingChange}
            >
              <Text style={styles.buttonText}>{loadingChange ? 'Đang đổi...' : 'Đổi mật khẩu'}</Text>
            </TouchableOpacity>
            <Button title="Đóng" color="#888" onPress={() => setShowChangePassword(false)} />
          </View>
        </View>
      </Modal>
      <Modal visible={showEditModal} transparent animationType="slide" onRequestClose={() => setShowEditModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Cập nhật tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên mới"
              value={editName}
              onChangeText={setEditName}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
            <Button title="Đóng" color="#888" onPress={() => setShowEditModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  email: { fontSize: 16, color: '#666', marginBottom: 8 },
  infoContainer: { marginBottom: 32 },
  label: { fontSize: 16, color: '#333', marginBottom: 8 },
  value: { fontWeight: '500', color: '#007AFF' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 8, width: '80%' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#007AFF', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProfileScreen; 