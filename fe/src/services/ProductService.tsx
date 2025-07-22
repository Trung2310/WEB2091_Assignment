import api from '../configs/api';
import qs from 'qs';

export interface Product {
  id: string; 
  name: string;
  price: number;
  color: string;
  brandId?: number;
  categoryId?: number;
  size?: number[];
  image: string; 
  stock?: number;
  description?: string;
  isAvailable?: boolean;
}

export const productService = {
  getAll: async (search: string): Promise<Product[]> => {
    const res = await api.get(`/products`, {
      params: {
        q: search,
        _expand: ['brand', 'category'],
      },
      paramsSerializer: params => qs.stringify(params, {arrayFomat: 'repeat'})
    });
    return res.data;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  add: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const randomId = `PROD${Math.floor(1000 + Math.random() * 9000)}`;
    const newProduct = { ...product, id: randomId };
    const res = await api.post(`/products`, newProduct);
    return res.data;
  },

  update: async (id: string, product: Product): Promise<Product> => {
    const res = await api.put(`products/${id}`, product);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`products/${id}`);
  },
};
