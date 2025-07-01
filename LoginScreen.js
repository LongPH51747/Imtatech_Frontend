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
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = props.navigation || { navigate: () => {}, replace: () => {} };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    setLoading(true);
    try {
      const res = await apiLogin(email, password);
      console.log('Login response:', res);
      if (res.data && res.data.token) {
        await AsyncStorage.setItem('token', res.data.token);
      }
      Alert.alert('Thành công', 'Đăng nhập thành công!');
      navigation.replace('MainTab');
    } catch (error) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColo12r="transparent" translucent barStyle="default" />
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
          keyboardType="visible-password"
          secureTextEntry={true}
          onchangeText={setPassword}
          value={password}
          icon={''}
        />
        <ButtonForm
          onPress={handleLogin}
          onPressRegister={() => navigation.navigate('SignUp')}
          title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          text={'Bạn không có tài khoản'}
          subtitle={'Tạo tài khoản'}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', flex: 1 },
  image: { width: '100%', height: 350, marginTop: -50 },
  content: { padding: 24, justifyContent: 'center' },
});

export default LoginScreen; 