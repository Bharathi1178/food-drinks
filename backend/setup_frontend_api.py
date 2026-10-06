import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = BASE_DIR.parent
SRC_API_DIR = FRONTEND_DIR / "src" / "api"
SERVICES_DIR = SRC_API_DIR / "services"

SRC_API_DIR.mkdir(parents=True, exist_ok=True)
SERVICES_DIR.mkdir(parents=True, exist_ok=True)

# 1. .env and .env.development
env_content = "VITE_API_BASE_URL=http://127.0.0.1:8000/api\n"
(FRONTEND_DIR / ".env").write_text(env_content, encoding="utf-8")
(FRONTEND_DIR / ".env.development").write_text(env_content, encoding="utf-8")

# 2. axios.js
axios_code = """import axios from 'axios';

// Centralized Axios instance configured with backend URL
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
export const API_BASE_URL = rawBaseUrl.replace(/\\/+$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to attach JWT / Auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bitepos_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified logging and error management
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        console.warn('Unauthorized or token expired (401).');
        localStorage.removeItem('bitepos_token');
      } else if (status === 403) {
        console.warn('Access Forbidden (403).');
      } else {
        console.error(`API Error [${status}]:`, data);
      }
    } else if (error.request) {
      console.error('Network Error: Unable to reach backend at', API_BASE_URL);
    } else {
      console.error('Error in request setup:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
"""
(SRC_API_DIR / "axios.js").write_text(axios_code, encoding="utf-8")

# 3. authApi.js
auth_api_code = """import apiClient from './axios';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    if (response.data?.token) {
      localStorage.setItem('bitepos_token', response.data.token);
      localStorage.setItem('bitepos_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/user/');
      return response.data;
    } catch {
      try {
        return JSON.parse(localStorage.getItem('bitepos_user'));
      } catch {
        return null;
      }
    }
  },

  logout: () => {
    localStorage.removeItem('bitepos_token');
    localStorage.removeItem('bitepos_user');
  },
};

export default authApi;
"""
(SRC_API_DIR / "authApi.js").write_text(auth_api_code, encoding="utf-8")

# 4. categoryApi.js
category_api_code = """import apiClient from './axios';

export const categoryApi = {
  getCategories: async () => {
    const response = await apiClient.get('/categories/');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await apiClient.get(`/categories/${id}/`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await apiClient.post('/categories/', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/categories/${id}/`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/categories/${id}/`);
    return response.data;
  },
};

export default categoryApi;
"""
(SRC_API_DIR / "categoryApi.js").write_text(category_api_code, encoding="utf-8")

# 5. productApi.js
product_api_code = """import apiClient from './axios';

export const productApi = {
  getProducts: async (params = {}) => {
    const response = await apiClient.get('/products/', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/products/${id}/`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await apiClient.post('/products/', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/products/${id}/`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}/`);
    return response.data;
  },

  toggleStatus: async (id, available) => {
    const response = await apiClient.patch(`/products/${id}/`, { available });
    return response.data;
  },
};

export default productApi;
"""
(SRC_API_DIR / "productApi.js").write_text(product_api_code, encoding="utf-8")

# 6. orderApi.js
order_api_code = """import apiClient from './axios';

export const orderApi = {
  getOrders: async (params = {}) => {
    const response = await apiClient.get('/orders/', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/orders/${id}/`);
    return response.data;
  },

  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders/', orderData);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await apiClient.patch(`/orders/${id}/`, { status });
    return response.data;
  },
};

export default orderApi;
"""
(SRC_API_DIR / "orderApi.js").write_text(order_api_code, encoding="utf-8")

# 7. customerApi.js
customer_api_code = """import apiClient from './axios';

export const customerApi = {
  getCustomers: async (params = {}) => {
    const response = await apiClient.get('/customers/', { params });
    return response.data;
  },

  getCustomerById: async (id) => {
    const response = await apiClient.get(`/customers/${id}/`);
    return response.data;
  },

  createCustomer: async (customerData) => {
    const response = await apiClient.post('/customers/', customerData);
    return response.data;
  },

  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`/customers/${id}/`, customerData);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await apiClient.delete(`/customers/${id}/`);
    return response.data;
  },
};

export default customerApi;
"""
(SRC_API_DIR / "customerApi.js").write_text(customer_api_code, encoding="utf-8")

# 8. paymentApi.js
payment_api_code = """import apiClient from './axios';

export const paymentApi = {
  processPayment: async (paymentData) => {
    const response = await apiClient.post('/payments/process/', paymentData);
    return response.data;
  },
};

export default paymentApi;
"""
(SRC_API_DIR / "paymentApi.js").write_text(payment_api_code, encoding="utf-8")

# 9. client.js (wrapper pointing to axios.js)
client_code = """import apiClient, { API_BASE_URL } from './axios';

export { API_BASE_URL };
export default apiClient;
"""
(SRC_API_DIR / "client.js").write_text(client_code, encoding="utf-8")

# 10. Service wrappers for backward compatibility with existing components
(SERVICES_DIR / "productService.js").write_text("""import { productApi } from '../productApi';

export const productService = {
  getAll: (params) => productApi.getProducts(params),
  getById: (id) => productApi.getProductById(id),
  create: (data) => productApi.createProduct(data),
  update: (id, data) => productApi.updateProduct(id, data),
  delete: (id) => productApi.deleteProduct(id),
  toggleStatus: (id, available) => productApi.toggleStatus(id, available),
};

export default productService;
""", encoding="utf-8")

(SERVICES_DIR / "categoryService.js").write_text("""import { categoryApi } from '../categoryApi';

export const categoryService = {
  getAll: () => categoryApi.getCategories(),
  getById: (id) => categoryApi.getCategoryById(id),
  create: (data) => categoryApi.createCategory(data),
  update: (id, data) => categoryApi.updateCategory(id, data),
  delete: (id) => categoryApi.deleteCategory(id),
};

export default categoryService;
""", encoding="utf-8")

(SERVICES_DIR / "orderService.js").write_text("""import { orderApi } from '../orderApi';

export const orderService = {
  getAll: (params) => orderApi.getOrders(params),
  getById: (id) => orderApi.getOrderById(id),
  create: (orderData) => orderApi.createOrder(orderData),
  updateStatus: (id, status) => orderApi.updateOrderStatus(id, status),
};

export default orderService;
""", encoding="utf-8")

(SERVICES_DIR / "customerService.js").write_text("""import { customerApi } from '../customerApi';

export const customerService = {
  getAll: (params) => customerApi.getCustomers(params),
  getById: (id) => customerApi.getCustomerById(id),
  create: (data) => customerApi.createCustomer(data),
  update: (id, data) => customerApi.updateCustomer(id, data),
  delete: (id) => customerApi.deleteCustomer(id),
};

export default customerService;
""", encoding="utf-8")

(SERVICES_DIR / "authService.js").write_text("""import { authApi } from '../authApi';

export const authService = {
  login: (credentials) => authApi.login(credentials),
  getCurrentUser: () => authApi.getCurrentUser(),
  logout: () => authApi.logout(),
};

export default authService;
""", encoding="utf-8")

print("Frontend API modules installed successfully!")
