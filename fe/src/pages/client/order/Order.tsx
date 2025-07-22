import React, { useEffect, useState } from 'react';
import { orderService } from '../../../services/OrderService';


interface Order {
  id: string;
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled'; 
}

const Order: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); 
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');  

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser?.id) {
        const userOrders = await orderService.getOrdersByUser(currentUser.id);
        setOrders(userOrders);
      }
    };
    fetchOrders();
  }, [currentUser]);

  return (
    <div>
      <h2>Đơn hàng của bạn</h2>
      {orders.length === 0 ? (
        <p>Hiện tại bạn chưa có đơn hàng nào.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order.id}>
              <h3>Đơn hàng {order.id}</h3>
              <p>Tổng tiền: {order.total} VND</p>
              <p>Trạng thái: {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
