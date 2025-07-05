import axios from 'axios';

export const BASE_URL = 'http://192.168.0.101:5000'; // Thay bằng URL backend thật

// --- API XÁC THỰC & SẢN PHẨM ---

;


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

// APi Cart
export const apiGetCartByUser = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/cart/getByUserId/${id}`);
    return res && res.data;
  } catch (error) {
    throw new Error(error?.error || error?.message);
  }
};


export const apiEditStatusTrue = async (id) => {
  try {
    const res = await axios.put(`${BASE_URL}/api/cart/updateStatusToTrue/${id}`);
    return res && res.data;
  } catch (error) {
    throw new Error(error?.error || error?.message);
  }
}

export const apiAddCart = async (id, data) => {
  try {

    const res = await axios.post(`${BASE_URL}/api/cart/addToCart/${id}`, data);
    return res && res.data;
  } catch (error) {
    throw new Error(error?.error || error?.message);
  }
};
export const apiRemoveCart = async (id, userId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/cart/deleteCartItem/${id}`, {
      data: { userId }, // gửi phần thân JSON ở đây
    });
    return res && res.data;
  } catch (error) {
    throw new Error(error?.error || error?.message);
  }
}

export const apiUpdateQuantity = async (id, data) => {
  try {
    const res = await axios.patch(`${BASE_URL}/api/cart/updateQuantity/cartItemId/${id}`, data);
    return res && res.data;
  } catch (error) {
    throw new Error(error?.error || error?.message);
  }
}

export const apiGetAddressesByUser = async (userId) => {
  try {
    console.log(userId)
    const res = await axios.get(`${BASE_URL}/api/address/getAddressByUserId/${userId}`);
    console.log(res)
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy địa chỉ');
  }
};
export const apiCreateOder = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/order/create`, data);
    return res && res.data;
  } catch (error) {
    throw new Error(error?.error || error?.message);
  }
}
export const apiGetOrdersByUser = async (userId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/order/getByUserId/${userId}`);
    console.log("đây là res apigetorder", res.data)
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Lỗi khi lấy đơn hàng');
  }
};
