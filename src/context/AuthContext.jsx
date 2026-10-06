import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return authService.getCurrentUser() || {
      id: 'usr-1',
      name: 'Aarav Patel',
      role: 'Cashier',
      email: 'cashier@bitepos.local',
    };
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setCurrentUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Quick switch role for testing cashier vs admin view
  const switchRole = (role) => {
    const updated = {
      ...currentUser,
      role,
      name: role === 'Admin' ? 'Vikram Singh' : (role === 'Cashier' ? 'Aarav Patel' : 'Meera Das'),
      email: `${role.toLowerCase()}@bitepos.local`,
    };
    setCurrentUser(updated);
    localStorage.setItem('bitepos_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
