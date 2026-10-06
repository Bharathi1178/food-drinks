import axios from 'axios';

export const ADMIN_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const axiosAdmin = axios.create({
  baseURL: ADMIN_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('bitepos_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

axiosAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized or session expired
      localStorage.removeItem('bitepos_admin_token');
      localStorage.removeItem('bitepos_admin_session');
    }
    return Promise.reject(error);
  }
);

export default axiosAdmin;
