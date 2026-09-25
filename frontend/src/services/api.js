import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear token if invalid / expired
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
      const message = error.response.data?.message || 'Unauthorized: Please log in to access this resource';
      return Promise.reject(new Error(message));
    }
    return Promise.reject(new Error('Network error. Please check your connection.'));
  }
);

// Exported API endpoints
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/users/me'),
  updateMe: (userData) => apiClient.put('/users/me', userData),
};

export const productsAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id) => apiClient.get(`/products/${id}`),
  search: (keyword) => apiClient.get(`/products/search?keyword=${encodeURIComponent(keyword)}`),
  getByCategory: (categoryId) => apiClient.get(`/products/category/${categoryId}`),
  getReviews: (productId) => apiClient.get(`/products/${productId}/reviews`),
  addReview: (productId, reviewData) => apiClient.post(`/products/${productId}/reviews`, reviewData),
};

export const categoriesAPI = {
  getAll: () => apiClient.get('/categories'),
};

export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addItem: (productId, quantity = 1) => apiClient.post('/cart/items', { productId, quantity }),
  updateQuantity: (productId, quantity) => apiClient.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => apiClient.delete(`/cart/items/${productId}`),
  clearCart: () => apiClient.delete('/cart'),
};

export const wishlistAPI = {
  getWishlist: () => apiClient.get('/wishlist'),
  add: (productId) => apiClient.post(`/wishlist/${productId}`),
  remove: (productId) => apiClient.delete(`/wishlist/${productId}`),
};

export const addressesAPI = {
  getAll: () => apiClient.get('/addresses'),
  create: (addressData) => apiClient.post('/addresses', addressData),
  update: (id, addressData) => apiClient.put(`/addresses/${id}`, addressData),
  delete: (id) => apiClient.delete(`/addresses/${id}`),
};

export const couponsAPI = {
  getAll: () => apiClient.get('/coupons'),
  validate: (code, orderAmount) => apiClient.post('/coupons/validate', { code, orderAmount }),
};

export const deliverySlotsAPI = {
  getAll: () => apiClient.get('/delivery-slots'),
};

export const ordersAPI = {
  create: (orderData) => apiClient.post('/orders', orderData),
  getUserOrders: () => apiClient.get('/orders'),
  getById: (id) => apiClient.get(`/orders/${id}`),
  cancel: (id) => apiClient.put(`/orders/${id}/cancel`),
  getBuyAgain: () => apiClient.get('/orders/buy-again'),
  getAnalytics: () => apiClient.get('/orders/analytics'),
};

export const groceryListAPI = {
  getAll: () => apiClient.get('/grocery-lists'),
  create: (data) => apiClient.post('/grocery-lists', data),
  addOrUpdateItem: (listId, data) => apiClient.post(`/grocery-lists/${listId}/items`, data),
  removeItem: (listId, productId) => apiClient.delete(`/grocery-lists/${listId}/items/${productId}`),
  delete: (listId) => apiClient.delete(`/grocery-lists/${listId}`),
};

export const notificationsAPI = {
  getAll: () => apiClient.get('/notifications'),
  markAsRead: (id) => apiClient.put(`/notifications/${id}/read`),
};

// Admin API
export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getAnalytics: () => apiClient.get('/admin/analytics'),
  getOrders: (status) => apiClient.get(status ? `/admin/orders?status=${status}` : '/admin/orders'),
  updateOrderStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }),
  assignDeliveryPerson: (orderId, deliveryPersonId) => apiClient.put(`/admin/orders/${orderId}/assign-delivery`, { deliveryPersonId }),
  
  // Products
  getProducts: () => apiClient.get('/admin/products'),
  createProduct: (data) => apiClient.post('/admin/products', data),
  updateProduct: (id, data) => apiClient.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),
  getLowStock: (threshold = 10) => apiClient.get(`/admin/low-stock?threshold=${threshold}`),

  // Categories
  getCategories: () => apiClient.get('/admin/categories'),
  createCategory: (data) => apiClient.post('/admin/categories', data),
  updateCategory: (id, data) => apiClient.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/admin/categories/${id}`),

  // Users
  getUsers: () => apiClient.get('/admin/users'),

  // Reviews
  getReviews: () => apiClient.get('/admin/reviews'),

  // Coupons
  getCoupons: () => apiClient.get('/admin/coupons'),
  createCoupon: (data) => apiClient.post('/admin/coupons', data),
  updateCoupon: (id, data) => apiClient.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => apiClient.delete(`/admin/coupons/${id}`),

  // Delivery Slots
  getDeliverySlots: () => apiClient.get('/admin/delivery-slots'),
  createDeliverySlot: (data) => apiClient.post('/admin/delivery-slots', data),
  updateDeliverySlot: (id, data) => apiClient.put(`/admin/delivery-slots/${id}`, data),
  deleteDeliverySlot: (id) => apiClient.delete(`/admin/delivery-slots/${id}`),

  // Delivery Persons
  getDeliveryPersons: () => apiClient.get('/admin/delivery-persons'),
  createDeliveryPerson: (data) => apiClient.post('/admin/delivery-persons', data),
  updateDeliveryPerson: (id, data) => apiClient.put(`/admin/delivery-persons/${id}`, data),
  deleteDeliveryPerson: (id) => apiClient.delete(`/admin/delivery-persons/${id}`),
  activateDeliveryPerson: (id) => apiClient.put(`/admin/delivery-persons/${id}/activate`),
  deactivateDeliveryPerson: (id) => apiClient.put(`/admin/delivery-persons/${id}/deactivate`),
};

// Delivery Person API
export const deliveryAPI = {
  getDashboard: () => apiClient.get('/delivery/dashboard'),
  getOrders: () => apiClient.get('/delivery/orders'),
  getOrderById: (id) => apiClient.get(`/delivery/orders/${id}`),
  acceptDelivery: (id) => apiClient.put(`/delivery/orders/${id}/accept`),
  updateStatus: (id, status) => apiClient.put(`/delivery/orders/${id}/status`, { status }),
  getHistory: (period = 'all') => apiClient.get(`/delivery/history?period=${period}`),
  getProfile: () => apiClient.get('/delivery/profile'),
  updateProfile: (data) => apiClient.put('/delivery/profile', data),
};

export default apiClient;
