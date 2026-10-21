import axios from 'axios';

// Resolve API base URL:
// 1. If VITE_API_URL is explicitly set, use that.
// 2. If running locally (localhost / 127.0.0.1 / Wi-Fi IP), use '/api' (Vite dev proxy -> localhost:8080).
// 3. In cloud production (Vercel), default automatically to the live Render backend.
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.') || host.startsWith('172.')) {
      return '/api';
    }
  }
  return 'https://cargoconnect-backend.onrender.com/api';
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

// Response interceptor: handle 401 Unauthorized & 403 Forbidden by clearing stale session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const isAuthEndpoint = error.config?.url && (
      error.config.url.includes('/auth/login') || 
      error.config.url.includes('/auth/register') ||
      error.config.url.includes('/auth/verify-email') ||
      error.config.url.includes('/auth/forgot-password')
    );

    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      console.warn(`[CargoConnect API] Stale or forbidden token detected (${status}). Clearing session.`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
