import React, { createContext, useContext, useState, useEffect } from 'react';
import { customerDB } from '../api/customerDatabase';

const CustomerAuthContext = createContext();
const CUSTOMER_SESSION_KEY = 'bitepos_customer_session';

export const CustomerAuthProvider = ({ children }) => {
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login'); // 'login' | 'signup'

  // Sync session changes to localStorage
  const saveSession = (customer) => {
    if (customer) {
      setCurrentCustomer(customer);
      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customer));
    } else {
      setCurrentCustomer(null);
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
    }
  };

  // Sign in customer
  const login = async (identifier, password) => {
    const res = customerDB.authenticate(identifier, password);
    if (res.success) {
      saveSession(res.customer);
      setAuthModalOpen(false);
      return { success: true, customer: res.customer };
    }
    return { success: false, notFound: res.notFound, message: res.message };
  };

  // Quick Guest / Demo Login
  const loginDemoCustomer = () => {
    let demoCust = customerDB.findByEmailOrPhone('9876543210');
    if (!demoCust) {
      demoCust = customerDB.register({
        name: 'Demo Customer',
        phone: '9876543210',
        email: 'customer@bitecraze.com',
        password: 'Bite@1234',
        address: 'No 45, Anna Nagar, 2nd Cross Street',
        landmark: 'Near Metro Station',
        foodPreference: 'all',
        defaultOrderType: 'Delivery',
        spicePreference: 'Medium',
      });
    }
    saveSession(demoCust);
    setAuthModalOpen(false);
    return demoCust;
  };

  // Sign up new customer
  const signup = async (signupData) => {
    try {
      const newCustomer = customerDB.register(signupData);
      saveSession(newCustomer);
      setAuthModalOpen(false);
      return { success: true, customer: newCustomer };
    } catch (err) {
      return { success: false, message: err.message || 'Signup failed' };
    }
  };

  // Log out customer
  const logout = () => {
    saveSession(null);
  };

  // Update profile details
  const updateProfile = (profileData) => {
    if (!currentCustomer?.id) return null;
    const updated = customerDB.update(currentCustomer.id, profileData);
    if (updated) {
      saveSession(updated);
      return updated;
    }
    return null;
  };

  // Update common customer settings
  const updateSettings = (settingsData) => {
    if (!currentCustomer?.id) return null;
    const updated = customerDB.update(currentCustomer.id, settingsData);
    if (updated) {
      saveSession(updated);
      return updated;
    }
    return null;
  };

  const openLoginModal = () => {
    setAuthModalTab('login');
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthModalTab('signup');
    setAuthModalOpen(true);
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        currentCustomer,
        isLoggedIn: Boolean(currentCustomer),
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        openLoginModal,
        openSignupModal,
        login,
        loginDemoCustomer,
        signup,
        logout,
        updateProfile,
        updateSettings,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomerAuth = () => useContext(CustomerAuthContext);
