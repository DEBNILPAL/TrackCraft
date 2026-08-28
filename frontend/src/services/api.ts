import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token header on every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tracker_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle Response Errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized token, clear token
      const isAuthRoute = error.config.url?.includes('/auth/login') || error.config.url?.includes('/auth/signup');
      if (!isAuthRoute) {
        localStorage.removeItem('tracker_token');
        localStorage.removeItem('tracker_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
