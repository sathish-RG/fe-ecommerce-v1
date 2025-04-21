import axios from 'axios';

const baseURL = 'https://be-ecommerce-v1.onrender.com/api/v1';

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor to add Authorization header
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or from cookies or any storage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
