import api from '../configs/api';
import type { Order } from '../interfaces/orders';

export const orderService = {
  getAll: async (createdAt: string | ''): Promise<Order[]> => {
    console.log(createdAt);
    
    const res = await api.get(`/orders?createAt=${createdAt}`);
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

  add: async (newOrder: any): Promise<Order> => {
    const newOrderUp: any = {
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
