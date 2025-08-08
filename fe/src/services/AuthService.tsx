import api from '../configs/api';
import type { User } from '../interfaces/users';

const generateId = () => {
  const prefix = 'CUS';
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${random}`;
};

export const authService = {

  login: async ({ email, password }: { email: string, password: string }): Promise<User | null> => {
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

  register: async ({ email, password, fullName }: { email: string, password: string, fullName: string }): Promise<User> => {
    const idN = generateId();
    const res = await api.post('/register', {email, password, fullName, role: 'customer', id: idN});
    return res.data;
  },

  logout: (): void => {
    localStorage.removeItem('user');
    // localStorage.clear();
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    return user !== null;
  },
};
