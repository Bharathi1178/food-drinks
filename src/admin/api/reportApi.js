import axiosAdmin from './axiosAdmin';

export const reportApi = {
  getReports: async (params = {}) => {
    try {
      const res = await axiosAdmin.get('/admin/reports/', { params });
      return res.data;
    } catch (err) {
      console.warn('Backend admin reports API fallback:', err.message);
      return {
        period: params.period || 'today',
        total_turnover: 0,
        order_count: 0,
        average_order_value: 0,
        payment_breakdown: {
          Cash: { count: 0, amount: 0 },
          UPI: { count: 0, amount: 0 },
          Card: { count: 0, amount: 0 }
        },
        weekly_breakdown: [],
        monthly_breakdown: []
      };
    }
  }
};
