import api from '../configs/api';

export const clientService = {
  getProducts: async () => {
    const res = await api.get('/products');
    return res.data;
  },

  getUserProfile: async (userId: string) => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },

  searchProducts: async (query: string) => {
    const res = await api.get(`/products?search=${query}`);
    return res.data;
  },
};
