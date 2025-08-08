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
  note: string;
  paymentMethod: string;
}