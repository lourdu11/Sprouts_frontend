import axios from 'axios';
import { BASE_URL } from '../config/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sprouts-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

