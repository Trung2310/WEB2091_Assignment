import api from '../configs/api';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user';
  isActive: boolean;
}

export const authService = {

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


  register: async (user: User): Promise<User> => {
    const res = await api.post('/register', user);
    return res.data;
  },


  logout: (): void => {
    localStorage.removeItem('user');
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
