import axios from 'axios';

// URL server đã deploy lên Render
// Nếu muốn test local thì đổi lại thành: 'http://localhost:3000/api'
const API_URL = 'https://api-management-v5ez.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm token vào mỗi request nếu có
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
