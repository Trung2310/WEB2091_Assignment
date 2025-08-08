import api from '../configs/api';
import type { Brand } from '../interfaces/brands';
import type { CrudService } from '../interfaces/crud';

export const brandService: CrudService<Brand, Omit<Brand, 'id'>, number> = {
  getAll: async (): Promise<Brand[]> => {
    const res = await api.get(`/brands`);
    return res.data;
  },

  getById: async (id: number): Promise<Brand> => {
    const res = await api.get(`/brands/${id}`);
    return res.data;
  },

  add: async (brand: Omit<Brand, 'id'>): Promise<Brand> => {
    const res = await api.post(`/brands`, brand);
    return res.data;
  },

  update: async (id: number, brand: Brand): Promise<Brand> => {
    const res = await api.put(`/brands/${id}`, brand);
    return res.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/brands/${id}`);
  },
};
