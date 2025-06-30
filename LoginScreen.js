/**
 * Màn hình Đăng nhập (Login Screen)
 * 
 * Màn hình này cho phép người dùng đăng nhập với các chức năng:
 * - Đăng nhập bằng số điện thoại và OTP
 * - Đăng nhập bằng Google
 * - Xác thực người dùng
 * - Lưu thông tin đăng nhập
 * - Chuyển hướng đến màn hình Home sau khi đăng nhập thành công
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  Alert,
  Modal,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import WrapTextInput from './customcomponent/wrapinput';
import Title from './customcomponent/title';
import ButtonForm from './customcomponent/form';
import { apiLogin, apiForgotPassword, BASE_URL } from './api';

const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const navigation = props.navigation || { navigate: () => {}, replace: () => {} };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      Alert.alert('Lỗi', 'Vui lòng nhập email');
      return;
    }
    try {
      const result = await apiForgotPassword(forgotEmail);
      Alert.alert('Thành công', 'Đã gửi email đặt lại mật khẩu!');
      setForgotModalVisible(false);
      setForgotEmail('');
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="transparent" translucent barStyle="default" />
      <Image source={require('./img/imagelogin.png')} style={styles.image} />
      <View style={styles.content}>
        <Title title="Chào mừng bạn" subtitle="Đăng nhập tài khoản" />
        <WrapTextInput
          placeholder="Nhập email"
          onchangeText={setEmail}
          value={email}
          icon={''}
        />
        <WrapTextInput
          placeholder="Nhập password"
          onchangeText={setPassword}
          value={password}
          icon={''}
        />
        <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
          <Text style={{ color: '#007AFF', textAlign: 'right', marginBottom: 16 }}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <ButtonForm
          onPress={handleLogin}
          onPressRegister={() => navigation.navigate('SignUp')}
          title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          text={'Bạn không có tài khoản'}
          subtitle={'Tạo tài khoản'}
        />
      </View>
      {/* Modal Quên mật khẩu */}
      <Modal
        visible={forgotModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setForgotModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Quên mật khẩu</Text>
            <WrapTextInput
              placeholder="Nhập email của bạn"
              onchangeText={setForgotEmail}
              value={forgotEmail}
              icon={''}
            />
            <Button title="Gửi email đặt lại mật khẩu" onPress={handleForgotPassword} />
            <Button title="Đóng" color="#888" onPress={() => setForgotModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', flex: 1 },
  image: { width: '100%', height: 350, marginTop: -50 },
  content: { padding: 24, justifyContent: 'center' },
});

export default LoginScreen; 