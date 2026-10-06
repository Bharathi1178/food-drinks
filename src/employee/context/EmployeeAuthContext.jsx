import React, { createContext, useContext, useState, useEffect } from 'react';
import employeeAuthApi from '../api/employeeAuthApi';

const EmployeeAuthContext = createContext(null);
const EMPLOYEE_SESSION_KEY = 'bitepos_employee_session';

export const EmployeeAuthProvider = ({ children }) => {
  const [employee, setEmployee] = useState(() => {
    try {
      const stored = localStorage.getItem(EMPLOYEE_SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async ({ employeeId, name, email }) => {
    setLoading(true);
    try {
      const res = await employeeAuthApi.login({ employeeId, name, email });
      if (res.success && res.employee) {
        setEmployee(res.employee);
        localStorage.setItem(EMPLOYEE_SESSION_KEY, JSON.stringify(res.employee));
        if (res.token) {
          localStorage.setItem('bitepos_employee_token', res.token);
        }
        return { success: true, employee: res.employee };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Invalid Employee credentials',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setEmployee(null);
    localStorage.removeItem(EMPLOYEE_SESSION_KEY);
    localStorage.removeItem('bitepos_employee_token');
  };

  return (
    <EmployeeAuthContext.Provider
      value={{
        employee,
        isAuthenticated: !!employee && (employee.status || '').toLowerCase() === 'active',
        loading,
        login,
        logout,
      }}
    >
      {children}
    </EmployeeAuthContext.Provider>
  );
};

export const useEmployeeAuth = () => {
  const context = useContext(EmployeeAuthContext);
  if (!context) {
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider');
  }
  return context;
};

export default EmployeeAuthContext;
