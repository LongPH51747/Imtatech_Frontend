import axios from 'axios';

export const BASE_URL = 'https://efd5-42-116-197-106.ngrok-free.app'; // Thay bằng URL backend thật

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

export const apiUpdateProfile = (token, profileData) =>
  axios.put(`${BASE_URL}/api/users/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const apiChangePassword = async (token, oldPassword, newPassword) => {
  return axios.post(
    `${BASE_URL}/api/users/change-password`,
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}; 