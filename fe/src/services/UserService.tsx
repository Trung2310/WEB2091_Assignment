import api from '../configs/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  isActive: boolean;
}

// Hàm tự tạo ID theo role
const generateId = (role: string): string => {
  const prefix = {
    admin: 'ADM',
    staff: 'STF',
    user: 'USR',
  }[role] || 'GEN';

  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get('/users');
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
      const res = await api.post('/login', { email, password });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));  
      return user;
    } catch (error) {
      console.error('Đăng nhập thất bại', error);
      return null;
    }
  },

  logout: (): void => {
    localStorage.removeItem('user');
  },
};
