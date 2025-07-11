/**
 * Màn hình Đăng ký (Sign Up Screen)
 * 
 * Màn hình này cho phép người dùng đăng ký tài khoản mới với các chức năng:
 * - Nhập thông tin đăng ký (email, mật khẩu, xác nhận mật khẩu)
 * - Kiểm tra tính hợp lệ của thông tin
 * - Đăng ký tài khoản mới
 * - Chuyển đến màn hình đăng nhập
 */

import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import WrapTextInput from '../customcomponent/wrapinput';
import Title from '../customcomponent/title';
import ButtonForm from '../customcomponent/form';
import { apiRegister, BASE_URL } from '../api';

const SignUpScreen = (props) => {
  const navigation = props.navigation || { navigate: () => {}, replace: () => {} };
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !name || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }
    setLoading(true);
    try {
      const res = await apiRegister(name, email, password);
      Alert.alert('Thành công', 'Đăng ký thành công!');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Register error:', error, error?.response?.data);
      Alert.alert('Lỗi', error.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor="transparent" translucent barStyle="default" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={require('../img/imagelogin.png')} style={styles.image} />
        <View style={styles.content}>
          <Title title="Đăng ký" subtitle="Tạo tài khoản" />
          <WrapTextInput
            placeholder="Email"
            onchangeText={setEmail}
            value={email}
            icon={''}
          />
          <WrapTextInput
            placeholder="Họ tên"
            onchangeText={setName}
            value={name}
            icon={''}
          />
          <WrapTextInput
            placeholder="Nhập password"
            onchangeText={setPassword}
            value={password}
            icon={''}
          />
          <WrapTextInput
            placeholder="Nhập lại password"
            onchangeText={setConfirmPassword}
            value={confirmPassword}
            icon={''}
          />
          <ButtonForm
            onPress={handleRegister}
            onPressRegister={() => navigation.navigate('Login')}
            title={loading ? 'Đang đăng ký...' : 'Đăng ký'}
            text={'Tôi đã có tài khoản'}
            subtitle={'Đăng nhập'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'transparent', flex: 1 },
  image: { width: '100%', height: 350, marginTop: -150 },
  content: { padding: 24, justifyContent: 'center' },
  scrollContent: { flexGrow: 1 },
});

export default SignUpScreen; 