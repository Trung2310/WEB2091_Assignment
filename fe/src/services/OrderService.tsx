import api from '../configs/api';
import type { CartItem } from './CartService';

interface OrderItem {
  productId: string;
  name: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const res = await api.get(`/orders`);
    return res.data;
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    const res = await api.get(`/orders?userId=${userId}`);
    return res.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  // Client: Tạo đơn hàng từ giỏ hàng
  createOrder: async (cart: CartItem[], userId: string, userName: string): Promise<Order> => {
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const newOrder: Order = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      userId,
      userName,
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        size: item.product.size ? item.product.size[0] : 0, // Chọn size đầu tiên trong mảng
        color: item.product.color,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const res = await api.post('/orders', newOrder);
    return res.data;
  },

  add: async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const newOrder: Order = {
      ...order,
      id: Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
    };
    const res = await api.post(`/orders`, newOrder);
    return res.data;
  },

  update: async (id: string, order: Order): Promise<Order> => {
    const res = await api.put(`/orders/${id}`, order);
    return res.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

   updateStatus: async (id: string, status: string) => {
    return await api.patch(`/orders/${id}`, { status });
  },
};
