import apiClient from '../client';
import { resetToDefaults } from '../mockAdapter';

export const settingService = {
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await apiClient.put('/settings', settings);
    return response.data;
  },

  resetDatabase: async () => {
    resetToDefaults();
    return { success: true };
  }
};
