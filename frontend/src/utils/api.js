import axios from 'axios';

// Resolve API base URL: Uses VITE_API_URL in production, or falls back to '/api' for local Vite dev proxy
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  return '/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Authorization Bearer token & normalize redundant '/api/' prefix
api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.substring(4); // converts '/api/foo' to '/foo' against baseURL '.../api'
    } else if (config.url && config.url.startsWith('api/')) {
      config.url = '/' + config.url.substring(4);
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized by clearing stale session & redirecting to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
