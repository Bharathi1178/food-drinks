import axiosAdmin from './axiosAdmin';

const DEFAULT_EMPLOYEES = [
  { id: 'EMP-101', name: 'Arjun Verma', phone: '9876543201', email: 'arjun.manager@bitecraze.com', role: 'Manager', joiningDate: '2025-01-15', status: 'Active', availability: 'Available', totalOrdersHandled: 342, totalSalesHandled: 85400, profileInfo: 'General Store Manager overseeing shift operations, inventory auditing, and cash settlements.', recentActivity: 'Reviewed weekly sales closing report' },
  { id: 'EMP-102', name: 'Priya Nair', phone: '9876543202', email: 'priya.nair@bitecraze.com', role: 'Cashier', joiningDate: '2025-03-10', status: 'Active', availability: 'Busy', totalOrdersHandled: 285, totalSalesHandled: 64200, profileInfo: 'Front counter cashier handling dine-in and online takeaway orders with high speed.', recentActivity: 'Billed order ORD-1002 (UPI payment)' },
  { id: 'EMP-103', name: 'Aarav Patel', phone: '9876543203', email: 'aarav.pos@bitecraze.com', role: 'Cashier', joiningDate: '2025-04-01', status: 'Active', availability: 'Available', totalOrdersHandled: 198, totalSalesHandled: 49100, profileInfo: 'Counter staff & POS operator. Manages daily bill reconciliations.', recentActivity: 'Settled shift drawer cash register' },
  { id: 'EMP-104', name: 'Chef Rajesh Kumar', phone: '9876543204', email: 'rajesh.kitchen@bitecraze.com', role: 'Kitchen Staff', joiningDate: '2024-11-20', status: 'Active', availability: 'Available', totalOrdersHandled: 420, totalSalesHandled: 114500, profileInfo: 'Head Chef in charge of Dum Biryani, chicken gravies, and kitchen ingredient staging.', recentActivity: 'Prepared 15 portions of Chicken Dum Biryani' },
  { id: 'EMP-105', name: 'Sunil Joshi', phone: '9876543205', email: 'sunil.kitchen@bitecraze.com', role: 'Kitchen Staff', joiningDate: '2025-02-12', status: 'On Leave', availability: 'Off-duty', totalOrdersHandled: 180, totalSalesHandled: 43000, profileInfo: 'Assistant cook handling Dosa, snacks, and deep-fry varieties.', recentActivity: 'Approved personal leave' },
  { id: 'EMP-106', name: 'Karthik Raja', phone: '9876543206', email: 'karthik.delivery@bitecraze.com', role: 'Delivery Staff', joiningDate: '2025-05-01', status: 'Active', availability: 'Busy', totalOrdersHandled: 215, totalSalesHandled: 52300, profileInfo: 'Express delivery driver managing direct neighborhood orders.', recentActivity: 'Out for delivery on Anna Nagar route' },
  { id: 'EMP-107', name: 'Manoj Kumar', phone: '9876543207', email: 'manoj.delivery@bitecraze.com', role: 'Delivery Staff', joiningDate: '2025-06-15', status: 'Inactive', availability: 'Off-duty', totalOrdersHandled: 85, totalSalesHandled: 19500, profileInfo: 'Part-time weekend delivery associate.', recentActivity: 'Off shift schedule' }
];

export const employeeApi = {
  getEmployees: async (params = {}) => {
    try {
      const res = await axiosAdmin.get('/employees/', { params });
      return res.data;
    } catch (err) {
      console.warn('Backend employees API fallback:', err.message);
      let list = [...DEFAULT_EMPLOYEES];
      if (params.role && params.role !== 'all') {
        list = list.filter(e => e.role.toLowerCase() === params.role.toLowerCase());
      }
      if (params.status && params.status !== 'all') {
        list = list.filter(e => e.status.toLowerCase() === params.status.toLowerCase());
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(e => e.name.toLowerCase().includes(q) || e.phone.includes(q) || e.email.toLowerCase().includes(q));
      }
      return list;
    }
  },

  getEmployeeById: async (id) => {
    try {
      const res = await axiosAdmin.get(`/employees/${id}/`);
      return res.data;
    } catch (err) {
      return DEFAULT_EMPLOYEES.find(e => e.id === id) || null;
    }
  }
};
