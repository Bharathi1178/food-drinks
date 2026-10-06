import apiClient from '../client';

export const reportService = {
  getSummary: async () => {
    const response = await apiClient.get('/reports');
    return response.data;
  },
};
