import api from '../configs/api';
import type { User } from '../interfaces/users';
import { orderService } from './OrderService';

const generateId = (role: string): string => {
  const prefix = {
    admin: 'ADM',
    staff: 'STF',
    customer: 'CUS',
  }[role] || 'GEN';

  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

export const userService = {
  getAll: async (search: any): Promise<User[]> => {
    const res = await api.get('/users', {
      params: {
        q: search
      }
    });
    return res.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  add: async (user: Omit<User, 'id'>): Promise<User> => {
    const id = generateId(user.role);
    const res = await api.post('/users', { ...user, id });
    return res.data;
  },

  update: async (id: string, user: User): Promise<User> => {
    const res = await api.put(`/users/${id}`, user);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  login: async (email: string, password: string): Promise<User | null> => {
    try {
      const res = await api.get(`/users?email=${email}`);
      const users = res.data;

      if (users.length === 0) {
        console.error('Email không tồn tại');
        return null;
      }

      const user = users[0];

      if (user.password !== password) {
        console.error('Sai mật khẩu');
        return null;
      }

      localStorage.clear();

      localStorage.setItem('user', JSON.stringify(user));

      const orders = await orderService.getOrdersByUser(user?.id);

      if (orders.length > 0) {
        localStorage.setItem('orders', JSON.stringify(orders));
      }
      return user;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      return null;
    }
  },

  logout: (): void => {
    localStorage.removeItem('user');
    localStorage.clear();
  },
};
