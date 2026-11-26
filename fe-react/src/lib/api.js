import axios from 'axios'

// Dev: /api diteruskan ke Laravel lewat proxy di vite.config.js
export const api = axios.create({
  baseURL: '/api/v1',
  headers: { Accept: 'application/json' },
})

/**
 * INTERCEPTOR REQUEST
 * Otomatis suntikkan token Bearer ke setiap request jika ada di localStorage.
 * Ini yang membuat request ke endpoint auth:sanctum (logout, change-password) bisa jalan.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * INTERCEPTOR RESPONSE
 * Tangani 401 global: jika token invalid/expired, bersihkan localStorage.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Jangan redirect saat login (karena login memang bisa dapat 401)
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      if (!isLoginRequest) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        // Redirect ke login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
