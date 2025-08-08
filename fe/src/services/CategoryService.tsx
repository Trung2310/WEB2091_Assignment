import api from '../configs/api';
import type { Category } from '../interfaces/categories';
import type { CrudService } from '../interfaces/crud';

export const categoryService: CrudService<Category, Omit<Category, 'id'>, number> = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get(`/categories`);
    return res.data;
  },

  getById: async (id: number): Promise<Category> => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
  },

  add: async (category: Omit<Category, 'id'>): Promise<Category> => {
    const res = await api.post(`/categories`, category);
    return res.data;
  },

  update: async (id: number, category: Category): Promise<Category> => {
    const res = await api.put(`/categories/${id}`, category);
    return res.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
