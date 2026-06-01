import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

api.interceptors.request.use((cfg) => {
  // Public routes that should NOT have Authorization header
  // /api/auth/* - all auth endpoints (signup, login, logout)
  // GET /api/products* - product listings and details are public
  
  const isAuthRoute = cfg.url.startsWith('/api/auth/');
  const isPublicProductRoute = cfg.method?.toLowerCase() === 'get' && cfg.url.startsWith('/api/products');
  
  // Only add token if this is NOT a public route
  if (!isAuthRoute && !isPublicProductRoute) {
    const token = localStorage.getItem('token') || localStorage.getItem('sellerToken');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  
  return cfg;
});

export const authAPI = {
  userSignup: (data) => api.post('/api/auth/user/signup', data),
  userLogin: (data) => api.post('/api/auth/user/login', data),
  sellerSignup: (data) => api.post('/api/auth/seller/signup', data),
  sellerLogin: (data) => api.post('/api/auth/seller/login', data),
};

export const productAPI = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  remove: (id) => api.delete(`/api/products/${id}`),
  getSellerAnalytics: (sellerId) => api.get(`/api/products/seller/${sellerId}/analytics`),
};

export const sellerAPI = {
  getRevenue: () => api.get('/api/seller/dashboard'),
  getOrders: () => api.get('/api/seller/analytics'),
  getAnalytics: () => api.get('/api/seller/analytics'),
};

export const orderAPI = {
  getUserOrders: () => api.get('/api/orders/me'),
  getById: (id) => api.get(`/api/orders/${id}`),
};

export const paymentAPI = {
  createRazorpayOrder: (data) => api.post('/api/payment/create-order', data),
  verifyRazorpayPayment: (data) => api.post('/api/payment/verify', data),
};

export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const cartAPI = {
  add: (data) => api.post('/api/cart', data),
  getByUser: (userId) => api.get(`/api/cart/user/${userId}`),
  update: (cartItemId, data) => api.put(`/api/cart/${cartItemId}`, data),
  remove: (cartItemId) => api.delete(`/api/cart/${cartItemId}`),
};

export default api;

