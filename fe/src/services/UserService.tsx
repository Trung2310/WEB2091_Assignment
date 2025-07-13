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
  // Lấy tất cả người dùng
  getAll: async (): Promise<User[]> => {
    const res = await api.get('/users');
    return res.data;
  },

  // Lấy chi tiết theo ID
  getById: async (id: string): Promise<User> => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  // Thêm mới user (tự tạo id)
  add: async (user: Omit<User, 'id'>): Promise<User> => {
    const id = generateId(user.role);
    const res = await api.post('/users', { ...user, id });
    return res.data;
  },

  // Cập nhật user theo ID
  update: async (id: string, user: User): Promise<User> => {
    const res = await api.put(`/users/${id}`, user);
    return res.data;
  },

  // Xoá user theo ID
  remove: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
