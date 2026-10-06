import { categoryApi } from '../categoryApi';

export const categoryService = {
  getAll: () => categoryApi.getCategories(),
  getById: (id) => categoryApi.getCategoryById(id),
  create: (data) => categoryApi.createCategory(data),
  update: (id, data) => categoryApi.updateCategory(id, data),
  delete: (id) => categoryApi.deleteCategory(id),
};

export default categoryService;
