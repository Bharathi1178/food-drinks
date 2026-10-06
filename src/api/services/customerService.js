import { customerApi } from '../customerApi';

export const customerService = {
  getAll: (params) => customerApi.getCustomers(params),
  getById: (id) => customerApi.getCustomerById(id),
  create: (data) => customerApi.createCustomer(data),
  update: (id, data) => customerApi.updateCustomer(id, data),
  delete: (id) => customerApi.deleteCustomer(id),
};

export default customerService;
