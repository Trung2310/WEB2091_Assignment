import React, { useEffect, useState } from 'react';

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

const Order: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Lấy danh sách đơn hàng từ localStorage
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  return (
    <div className="order-container">
      <h2>Đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Hiện tại bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-item">
              <h3>Đơn hàng {order.id}</h3>
              <p>Tổng tiền: {order.total} VND</p>
              <p>Trạng thái: {order.status}</p>
              <div>
                <h4>Chi tiết đơn hàng:</h4>
                {order.items.map((item) => (
                  <div key={item.productId} className="order-item-details">
                    <p>{item.name} - {item.size} - {item.color} - {item.quantity} x {item.price} VND</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
