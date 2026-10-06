import apiClient from './axios';

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
