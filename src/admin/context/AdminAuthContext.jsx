import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../api/adminApi';

const AdminAuthContext = createContext();

const ADMIN_STORAGE_KEY = 'bitepos_admin_session';
const ADMIN_TOKEN_KEY = 'bitepos_admin_token';

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const u = JSON.parse(stored);
        if (u) {
          u.name = 'Admin';
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(u));
        }
        return u;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await adminApi.login(credentials);
      if (data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      }
      if (data.user) {
        const userObj = { ...data.user, name: 'Admin' };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(userObj));
        setAdminUser(userObj);
      }
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.message || 'Authentication failed';
      setAuthError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAuthenticated: !!adminUser,
        loading,
        authError,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
