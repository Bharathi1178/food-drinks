import { orderApi } from '../orderApi';

export const orderService = {
  getAll: (params) => orderApi.getOrders(params),
  getById: (id) => orderApi.getOrderById(id),
  create: (orderData) => orderApi.createOrder(orderData),
  updateStatus: (id, status) => orderApi.updateOrderStatus(id, status),
};

export default orderService;
