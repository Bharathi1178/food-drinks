import apiClient from './axios';

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
