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
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await AsyncStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
      }));
      Alert.alert('Thành công', 'Đăng nhập thành công!', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Home'),
        },
      ]);
    } catch (error) {
      let errorMessage = 'Đăng nhập thất bại';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Không tìm thấy tài khoản';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Sai mật khẩu';
      }
      Alert.alert('Lỗi', errorMessage);
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
      const result = await auth().sendPasswordResetEmail(forgotEmail);
      console.log('Password reset email sent result:', result);
      Alert.alert('Thành công', 'Đã gửi email đặt lại mật khẩu!');
      setForgotModalVisible(false);
      setForgotEmail('');
    } catch (error) {
      console.log('Forgot password error:', error);
      Alert.alert('Lỗi', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Đăng nhập</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setForgotModalVisible(true)}>
          <Text style={{ color: '#007AFF', textAlign: 'center', marginBottom: 16 }}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.footerLink}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
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
            <TextInput
              style={styles.input}
              placeholder="Nhập email của bạn"
              value={forgotEmail}
              onChangeText={setForgotEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
  footerLink: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 