import api from '../configs/api';
import type { CartItem } from './CartService';

export interface OrderItem {
  productId: string;
  name: string;
  size: number;
  color: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  completedAt: string | null;
  cancelledAt: string | null;
  address: string;
  paymentMethod: string;
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const res = await api.get(`/orders`);
    return res.data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    const res = await api.get(`/orders?userId=${userId}`);
    return res.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  createOrder: async (newOrder: any): Promise<Order> => {
    const newOrderUp: Order = {
      // id: Math.floor(10000 + Math.random() * 90000).toString(),
      id: newOrder.id,
      userId: newOrder.userId,
      userName: newOrder.userName,
      items: newOrder.items.map((item: any) => ({
        productId: item.id,
        name: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
      address: newOrder.address,
      paymentMethod: newOrder.paymentMethod,
      total: newOrder.total,
      status: 'Pending',
      createdAt: newOrder.createdAt,
      completedAt: null,
      cancelledAt: null
    };
    const res = await api.post('/orders', newOrderUp);
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

  updateStatus: async (id: string, status: 'Pending' | 'Completed' | 'Cancelled') => {
    const now = new Date().toISOString();
    let updateData: any = { status };

    if (status === 'Completed') {
      updateData.completedAt = now;
      updateData.cancelledAt = null;
    } else if (status === 'Cancelled') {
      updateData.cancelledAt = now;
      updateData.completedAt = null;
    } else {
      updateData.completedAt = null;
      updateData.cancelledAt = null;
    }

    return await api.patch(`/orders/${id}`, updateData);
  }
};
