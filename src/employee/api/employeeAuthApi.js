import apiClient from '../../api/axios';

export const employeeAuthApi = {
  login: async ({ employeeId, name, email }) => {
    // Direct call to Django backend authentication endpoint
    try {
      const response = await fetch('http://127.0.0.1:8000/api/employee/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_id: employeeId,
          name,
          email,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }
      return data;
    } catch (err) {
      // Fallback via axios apiClient
      const res = await apiClient.post('/employee/login/', {
        employee_id: employeeId,
        name,
        email,
      });
      return res.data;
    }
  },

  getOrders: async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/orders/');
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : data?.results || [];
      }
    } catch (e) {
      console.warn('Backend orders fetch fallback:', e);
    }
    const res = await apiClient.get('/orders/');
    return Array.isArray(res.data) ? res.data : res.data?.results || [];
  },

  updateOrderStatus: async (orderId, updateData) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (response.ok) {
        const data = await response.json();
        // Dispatch real-time events for Customer & Admin portals
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('bitepos_order_status_change', { detail: data }));
          window.dispatchEvent(new CustomEvent('bitepos_new_order', { detail: data }));
        }
        return data;
      }
    } catch (e) {
      console.warn('Backend order patch fallback:', e);
    }

    const res = await apiClient.patch(`/orders/${orderId}/`, updateData);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bitepos_order_status_change', { detail: res.data }));
      window.dispatchEvent(new CustomEvent('bitepos_new_order', { detail: res.data }));
    }
    return res.data;
  },

  getRegisteredEmployees: async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/employees/');
      if (response.ok) {
        const data = await response.json();
        return Array.isArray(data) ? data : data?.results || [];
      }
    } catch (e) {
      console.warn('Backend employees fetch fallback:', e);
    }
    return [];
  },
};

export default employeeAuthApi;
