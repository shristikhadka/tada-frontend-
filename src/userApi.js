import axios from 'axios';
import { getAuthToken } from './utils/auth';

// Create a separate axios instance for public endpoints (no auth needed)
const publicClient = axios.create({
  baseURL: "http://localhost:8080",
});


// Actually, let's create it here too for consistency
const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

// Add auth header to authenticated requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

// ========== PUBLIC ENDPOINTS (No auth required) ==========

/**
 * Register a new user
 * @param {Object} user - { userName: string, password: string, roles?: string[] }
 * @returns {Promise} User object
 */
export const registerUser = (user) => {
  return publicClient.post('/public/register', user);
};

export const testCredentials = (username, password) => {
  const credentials = btoa(`${username}:${password}`);
  return axios.get('http://localhost:8080/user/me', {
    headers: { 'Authorization': `Basic ${credentials}` }
  });
};

// ========== USER ENDPOINTS (Requires authentication) ==========

/**
 * Get current user profile
 * @returns {Promise} User object
 */
export const getCurrentUser = () => {
  return apiClient.get('/user/me');
};

/**
 * Update current user profile
 * @param {Object} userData - { userName?: string, password?: string, roles?: string[] }
 * @returns {Promise} Updated User object
 */
export const updateProfile = (userData) => {
  return apiClient.put('/user/me', userData);
};

/**
 * Change user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Success message
 */
export const changePassword = (oldPassword, newPassword) => {
  return apiClient.put('/user/change-password', {
    oldPassword,
    newPassword
  });
};

/**
 * Delete current user account
 * @returns {Promise} No content (204)
 */
export const deleteAccount = () => {
  return apiClient.delete('/user/me');
};