import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    console.log('[ApiClient] Request config:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      hasToken: !!token,
      fullURL: `${config.baseURL}${config.url}`
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('[ApiClient] No authentication token found!');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401/403 errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('[ApiClient] Response received:', {
      status: response.status,
      url: response.config.url,
      dataType: typeof response.data,
      isHTML: typeof response.data === 'string' && response.data.includes('<!DOCTYPE html>')
    });
    return response;
  },
  (error) => {
    console.error('[ApiClient] Response error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      isHTML: typeof error.response?.data === 'string' && error.response?.data.includes('<!DOCTYPE html>')
    });

    // If we get a 401 Unauthorized or 403 Forbidden, clear auth and redirect to login
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('[ApiClient] Authentication error, redirecting to login');
      console.log('[ApiClient] Error details:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        message: error.response?.data?.message
      });

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Only redirect if not already on the login page
      if (window.location.pathname !== '/login') {
        console.log('[ApiClient] Redirecting to login page');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
