import axios from 'axios';
import { getAuthToken } from './utils/auth';
import { API_BASE_URL } from './config';

// Create axios instance for admin endpoints (requires ADMIN role)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth header to authenticated requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }
  return config;
});

// ========== ADMIN ENDPOINTS (Requires ADMIN role) ==========

/**
 * Get all users
 * @returns {Promise} Array of User objects
 */
export const getAllUsers = () => {
  return apiClient.get('/admin/users');
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise} User object
 */
export const getUserById = (id) => {
  return apiClient.get(`/admin/users/${id}`);
};

/**
 * Create a new user with roles
 * @param {Object} user - { userName: string, password: string, roles: string[] }
 * @returns {Promise} Created User object
 */
export const createUser = (user) => {
  return apiClient.post('/admin/users', user);
};

/**
 * Update user roles
 * @param {number} id - User ID
 * @param {string[]} roles - Array of role names (e.g., ["USER", "ADMIN"])
 * @returns {Promise} Updated User object
 */
export const updateUserRoles = (id, roles) => {
  return apiClient.put(`/admin/users/${id}/roles`, roles);
};

/**
 * Reset user password (admin only)
 * @param {number} id - User ID
 * @param {string} newPassword - New password
 * @returns {Promise} Success message
 */
export const resetUserPassword = (id, newPassword) => {
  return apiClient.put(`/admin/users/${id}/password`, {
    newPassword
  });
};

/**
 * Delete a user
 * @param {number} id - User ID
 * @returns {Promise} No content (204)
 */
export const deleteUser = (id) => {
  return apiClient.delete(`/admin/users/${id}`);
};

