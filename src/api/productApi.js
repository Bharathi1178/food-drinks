import apiClient from './axios';

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
