import apiClient from '../../api/axios';

const BACKEND_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://127.0.0.1:8000/api' : null);

export const employeeAuthApi = {
  login: async ({ employeeId, name, email }) => {
    if (BACKEND_BASE) {
      try {
        const response = await fetch(`${BACKEND_BASE}/employee/login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employee_id: employeeId,
            name,
            email,
          }),
        });

        const data = await response.json();
        if (response.ok) return data;
      } catch (err) {
        // Fallback to client adapter
      }
    }

    const res = await apiClient.post('/employee/login/', {
      employee_id: employeeId,
      name,
      email,
    });
    return res.data;
  },

  getOrders: async () => {
    if (BACKEND_BASE) {
      try {
        const response = await fetch(`${BACKEND_BASE}/orders/`);
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data) ? data : data?.results || [];
        }
      } catch (e) {
        // Fallback to client adapter
      }
    }

    const res = await apiClient.get('/orders/');
    return Array.isArray(res.data) ? res.data : res.data?.results || [];
  },

  updateOrderStatus: async (orderId, updateData) => {
    if (BACKEND_BASE) {
      try {
        const response = await fetch(`${BACKEND_BASE}/orders/${orderId}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });
        if (response.ok) {
          const data = await response.json();
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('bitepos_order_status_change', { detail: data }));
            window.dispatchEvent(new CustomEvent('bitepos_new_order', { detail: data }));
          }
          return data;
        }
      } catch (e) {
        // Fallback to client adapter
      }
    }

    const res = await apiClient.patch(`/orders/${orderId}/`, updateData);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bitepos_order_status_change', { detail: res.data }));
      window.dispatchEvent(new CustomEvent('bitepos_new_order', { detail: res.data }));
    }
    return res.data;
  },

  getRegisteredEmployees: async () => {
    if (BACKEND_BASE) {
      try {
        const response = await fetch(`${BACKEND_BASE}/employees/`);
        if (response.ok) {
          const data = await response.json();
          return Array.isArray(data) ? data : data?.results || [];
        }
      } catch (e) {
        // Fallback to client adapter
      }
    }

    const res = await apiClient.get('/employees/');
    return Array.isArray(res.data) ? res.data : res.data?.results || [];
  },
};

export default employeeAuthApi;
