import axiosAdmin from './axiosAdmin';

const STORAGE_KEY = 'bitepos_custom_employees';

const getLocalEmployees = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

const setLocalEmployees = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const employeeApi = {
  getEmployees: async (params = {}) => {
    try {
      const res = await axiosAdmin.get('/employees/', { params });
      if (Array.isArray(res.data)) {
        setLocalEmployees(res.data);
        return res.data;
      }
      return getLocalEmployees();
    } catch (err) {
      console.warn('Backend employees API fetch fallback:', err.message);
      let list = getLocalEmployees();
      if (params.role && params.role !== 'all') {
        list = list.filter((e) => (e.role || '').toLowerCase() === params.role.toLowerCase());
      }
      if (params.department && params.department !== 'all') {
        list = list.filter((e) => (e.department || '').toLowerCase() === params.department.toLowerCase());
      }
      if (params.status && params.status !== 'all') {
        list = list.filter((e) => (e.status || '').toLowerCase() === params.status.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (e) =>
            (e.name || '').toLowerCase().includes(q) ||
            (e.id || '').toLowerCase().includes(q) ||
            (e.phone || '').includes(q) ||
            (e.department || '').toLowerCase().includes(q) ||
            (e.role || '').toLowerCase().includes(q)
        );
      }
      return list;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const res = await axiosAdmin.get(`/employees/${id}/`);
      return res.data;
    } catch (err) {
      return getLocalEmployees().find((e) => e.id === id) || null;
    }
  },

  createEmployee: async (employeeData) => {
    const localList = getLocalEmployees();
    const count = localList.length + 101;
    const empId = employeeData.id || employeeData.Emp_id || `EMP-${count}`;

    const payload = {
      id: empId,
      name: employeeData.name || employeeData.employeeName || '',
      phone: employeeData.phone || '',
      email: employeeData.email || '',
      department: employeeData.department || 'Kitchen',
      role: employeeData.role || 'Staff',
      status: employeeData.status || 'Active',
      availability: employeeData.availability || 'Available',
      profile_info: employeeData.profileInfo || employeeData.profile_info || '',
      recent_activity: employeeData.recentActivity || 'Registered by Director',
      total_orders_handled: 0,
      total_sales_handled: 0,
    };

    try {
      const res = await axiosAdmin.post('/employees/', payload);
      const saved = res.data;
      const updated = [saved, ...localList.filter((e) => e.id !== saved.id)];
      setLocalEmployees(updated);
      return saved;
    } catch (err) {
      console.warn('Backend employee creation fallback to local storage:', err.message);
      const newEmp = {
        ...payload,
        joiningDate: new Date().toISOString().split('T')[0],
        joining_date: new Date().toISOString().split('T')[0],
      };
      const updated = [newEmp, ...localList.filter((e) => e.id !== newEmp.id)];
      setLocalEmployees(updated);
      return newEmp;
    }
  },

  updateEmployee: async (id, employeeData) => {
    const localList = getLocalEmployees();
    try {
      const res = await axiosAdmin.patch(`/employees/${id}/`, employeeData);
      const updatedItem = res.data;
      const updatedList = localList.map((e) => (e.id === id ? { ...e, ...updatedItem } : e));
      setLocalEmployees(updatedList);
      return updatedItem;
    } catch (err) {
      console.warn('Backend employee update fallback to local storage:', err.message);
      const updatedList = localList.map((e) => (e.id === id ? { ...e, ...employeeData } : e));
      setLocalEmployees(updatedList);
      return updatedList.find((e) => e.id === id);
    }
  },

  deleteEmployee: async (id) => {
    const localList = getLocalEmployees();
    try {
      await axiosAdmin.delete(`/employees/${id}/`);
    } catch (err) {
      console.warn('Backend employee delete fallback:', err.message);
    }
    const filtered = localList.filter((e) => e.id !== id);
    setLocalEmployees(filtered);
    return { success: true, id };
  },
};
