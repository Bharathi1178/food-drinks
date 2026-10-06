import apiClient from '../client';

export const inventoryService = {
  getInventory: async () => {
    const response = await apiClient.get('/inventory');
    return response.data;
  },

  stockIn: async (stockInData) => {
    const response = await apiClient.post('/inventory/stock-in', stockInData);
    return response.data;
  },

  adjustStock: async (adjustmentData) => {
    const response = await apiClient.post('/inventory/adjustment', adjustmentData);
    return response.data;
  },
};
