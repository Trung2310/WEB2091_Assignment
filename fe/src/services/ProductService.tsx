// import axios from 'axios';
import api from '../configs/api';

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

// const API_URL = 'http://localhost:3001/products';

export const productService = {
  getAll: async (search: string): Promise<Product[]> => {
    const res = await api.get(`/products`, {
      params: {
        q: search
      }
    });
    // const res = await axios.get(API_URL);
    return res.data;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    // const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  add: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const randomId = `PROD${Math.floor(1000 + Math.random() * 9000)}`;
    const newProduct = { ...product, id: randomId };
    const res = await api.post(`/products`, newProduct);
    // const res = await axios.post(API_URL, newProduct);
    return res.data;
  },

  update: async (id: string, product: Product): Promise<Product> => {
    const res = await api.put(`products/${id}`, product);
    // const res = await axios.put(`${API_URL}/${id}`, product);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`products/${id}`);
    // await axios.delete(`${API_URL}/${id}`);
  },
};
