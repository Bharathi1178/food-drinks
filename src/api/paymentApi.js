import apiClient from './axios';

export const paymentApi = {
  processPayment: async (paymentData) => {
    const response = await apiClient.post('/payments/process/', paymentData);
    return response.data;
  },
};

export default paymentApi;
