import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://pakraaz.onrender.com',
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Check for different token types in localStorage
    const token = localStorage.getItem('token') || 
                  localStorage.getItem('adminToken') || 
                  localStorage.getItem('commission_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all possible tokens
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('commission_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;