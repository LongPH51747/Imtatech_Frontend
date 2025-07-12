import axios from 'axios';

export const API_BASE_URL = 'https://3c23700d5553.ngrok-free.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Gửi ảnh để bắt đầu một phiên nhận dạng mới.
 * @param {object} imageAsset - Object ảnh từ react-native-image-picker (chứa uri, type, fileName)
 * @returns {Promise<object>} Dữ liệu từ API
 */
export const identifyPlant = async imageAsset => {
  const formData = new FormData();
  formData.append('plantImage', {
    uri: imageAsset.uri,
    type: imageAsset.type,
    name: imageAsset.fileName,
  });

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/plant/identification`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
           'ngrok-skip-browser-warning': 'true' 
        },
      },
    );
    console.log("dâta", response.data);
    
    return response.data;
  } catch (error) {
    // Trả về lỗi để component có thể xử lý
    if (error.response) {
      // Server đã phản hồi với một mã trạng thái lỗi (4xx, 5xx)
      console.error('Data:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Yêu cầu đã được gửi đi nhưng không nhận được phản hồi
      // Thường là lỗi mạng, timeout, hoặc server không thể truy cập
      console.error('Request:', error.request);
      console.error('Lỗi mạng hoặc server không phản hồi.');
    } else {
      // Lỗi xảy ra trong quá trình thiết lập yêu cầu
      console.error('Error Message:', error.message);
    }
  }
};

/**
 * Gửi một câu hỏi vào cuộc hội thoại đã có.
 * @param {string} question - Câu hỏi của người dùng
 * @param {string} accessToken - Token của cuộc hội thoại
 * @returns {Promise<object>} Câu trả lời từ chatbot
 */
export const askQuestion = async (question, id) => {
  try {
    const response = await apiClient.post(
      `/api/plant/conversation/ask/${id}`,
      {
        question: question,
      },
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error('Lỗi mạng hoặc server không phản hồi');
  }
};
