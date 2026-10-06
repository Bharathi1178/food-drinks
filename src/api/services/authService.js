import { authApi } from '../authApi';

export const authService = {
  login: (credentials) => authApi.login(credentials),
  getCurrentUser: () => authApi.getCurrentUser(),
  logout: () => authApi.logout(),
};

export default authService;
