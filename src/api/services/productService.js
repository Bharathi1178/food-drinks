import { productApi } from '../productApi';

export const productService = {
  getAll: (params) => productApi.getProducts(params),
  getById: (id) => productApi.getProductById(id),
  create: (data) => productApi.createProduct(data),
  update: (id, data) => productApi.updateProduct(id, data),
  delete: (id) => productApi.deleteProduct(id),
  toggleStatus: (id, available) => productApi.toggleStatus(id, available),
};

export default productService;
