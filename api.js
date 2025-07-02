import axios from 'axios';

export const BASE_URL = 'http://192.168.1.41:5000'; // Thay bằng URL backend thật

// --- API XÁC THỰC & SẢN PHẨM ---

export const apiRegister = (name, email, password) =>
  axios.post(`${BASE_URL}/api/users/register`, { name, email, password });

export const apiLogin = (email, password) =>
  axios.post(`${BASE_URL}/api/users/login`, { email, password });

export const apiForgotPassword = (email) =>
  axios.post(`${BASE_URL}/api/users/forgot-password`, { email });

export const apiGetAllProducts = () =>
  axios.get(`${BASE_URL}/api/products/get-all-products`);

export const apiGetAllCategories = () =>
  axios.get(`${BASE_URL}/api/categories/get-all-categories`);

export const apiSearchProducts = (query) =>
  axios.get(`${BASE_URL}/api/products/search-product?q=${encodeURIComponent(query)}`);

export const apiGetRecommendedProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products`);
    return response;
  } catch (error) {
    console.error('API Error - Get Recommended Products:', error);
    throw error;
  }
};

export const apiGetProfile = (token) =>
  axios.get(`${BASE_URL}/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// ======================================================================
// === BỔ SUNG CÁC HÀM API MỚI CHO CHỨC NĂNG CHAT ===
// ======================================================================

/**
 * Gọi API để tìm hoặc tạo phòng chat giữa User và Admin.
 * @param {Object} data - Dữ liệu chứa adminId. Ví dụ: { adminId: '...' }
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise}
 */
export const apiFindOrCreateChat = (data, token) =>
  axios.post(`${BASE_URL}/api/chat/find-or-create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

/**
 * Lấy tất cả tin nhắn trong một phòng chat theo ID phòng.
 * @param {string} roomId - ID của phòng chat.
 * @param {string} token - Token xác thực của người dùng.
 * @returns {Promise}
 */
export const apiGetMessagesByRoom = (roomId, token) =>
  axios.get(`${BASE_URL}/api/chat/rooms/${roomId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  export const apiSendMessage = (messageData, token) =>
  axios.post(`${BASE_URL}/api/messages`, messageData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
