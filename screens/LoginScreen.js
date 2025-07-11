/**
 * Màn hình Đăng nhập (Login Screen) - Đã được nâng cấp để dùng AuthContext
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
import WrapTextInput from '../customcomponent/wrapinput';
import Title from '../customcomponent/title';
import ButtonForm from '../customcomponent/form';
// --- THAY ĐỔI 1: Chỉ import apiForgotPassword vì apiLogin đã được gọi trong Context ---
import { apiForgotPassword } from '../api'; 
// --- THAY ĐỔI 2: Import hook useAuth ---
import { useAuth } from '../context/AuthContext'; 

const LoginScreen = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const navigation = props.navigation || { navigate: () => {}, replace: () => {} };

  // --- THAY ĐỔI 3: Lấy hàm login và trạng thái isLoading từ AuthContext ---
  const { login, isLoading } = useAuth();
  // Dòng state `const [loading, setLoading] = useState(false);` không còn cần thiết.

  // --- THAY ĐỔI 4: VIẾT LẠI HOÀN TOÀN HÀM handleLogin ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    
    try {
      // Gọi hàm login từ context. Mọi logic phức tạp đã nằm trong đó.
      await login(email, password);
      // **Không cần Alert và không cần navigation.navigate ở đây nữa.**
      // Việc chuyển màn hình sẽ được xử lý tự động bởi AppNavigator.
    } catch (error) {
      // Nếu hàm login trong context thất bại, nó sẽ ném lỗi ra đây.
      Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  const handleForgotPassword = async () => {
    // Hàm này không thay đổi vì nó không liên quan đến trạng thái đăng nhập
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
      <Image source={require('../img/imagelogin.png')} style={styles.image} />
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
          // --- THAY ĐỔI 5: Sử dụng `isLoading` từ context thay vì `loading` từ state ---
          title={isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          text={'Bạn không có tài khoản'}
          subtitle={'Tạo tài khoản'}
        />
      </View>
      {/* Modal Quên mật khẩu (giữ nguyên) */}
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
