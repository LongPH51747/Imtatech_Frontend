
// redux/userActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks (được tạo bằng createAsyncThunk)
// Hàm đăng nhập giả định
export const userLogin = createAsyncThunk(
  'user/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Giả lập API call
      const response = await new Promise(resolve => setTimeout(() => {
        if (username === 'test' && password === 'password') {
          resolve({
            success: true,
            userData: { id: '1', name: 'Test User', email: 'test@example.com' },
            token: 'fake_jwt_token_12345',
          });
        } else {
          resolve({ success: false, message: 'Invalid credentials' });
        }
      }, 1000));

      if (response.success) {
        return { userData: response.userData, userToken: response.token };
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.message || 'An unknown error occurred');
    }
  }
);

// Hàm đăng xuất
export const userLogout = createAsyncThunk(
  'user/logout',
  async (_, { }) => {
    // Thực hiện các tác vụ dọn dẹp nếu cần (ví dụ: gọi API logout)
    return true; // Trả về giá trị để fulfilled action được kích hoạt
  }
);
