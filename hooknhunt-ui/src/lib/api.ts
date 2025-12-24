import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
    baseURL: `${API_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Request interceptor - Add auth token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle 401/403 errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // If we get a 401 Unauthorized or 403 Forbidden, clear auth and redirect to login
        // But only if it's not a specific permission error that we can handle gracefully
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // For 403 errors, check if it's a permission-related error that doesn't require logout
            if (error.response.status === 403 && error.response.data?.message === 'Access Denied') {
                // This is a role-based access denial, don't logout - let the component handle it
                console.warn('Access denied due to insufficient permissions');
                return Promise.reject(error);
            }

            // For 401 or other 403 errors, logout the user
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Only redirect if not already on the login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
