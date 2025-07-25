import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../../services/OrderService';

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  // Xóa 1 sản phẩm khỏi giỏ
  const handleRemove = (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Xóa toàn bộ giỏ hàng
  const handleRemoveAll = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

  // Tạo đơn hàng từ danh sách sản phẩm (dùng chung)
  const createOrder = async (items: any[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 9000) + 1000}`,
      userId: 'USR123',
      userName: 'Nguyễn Văn A',
      items,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    await orderService.createOrder(newOrder);
    return newOrder;
  };

  // Mua tất cả sản phẩm trong giỏ
  const handleBuyAll = async () => {
    const orderItems = cart.map((item) => ({
      productId: item.id,
      name: item.name,
      size: item.size || 42,
      color: item.color || 'Black/White',
      quantity: item.quantity,
      price: item.price,
    }));

    await createOrder(orderItems);
    handleRemoveAll(); // Xóa giỏ sau khi mua
    navigate('/order');
  };

  // Mua một sản phẩm
  const handleBuySingle = async (item: any) => {
    const orderItem = [{
      productId: item.id,
      name: item.name,
      size: item.size || 42,
      color: item.color || 'Black/White',
      quantity: item.quantity,
      price: item.price,
    }];

    await createOrder(orderItem);

    const updatedCart = cart.filter((c) => c.id !== item.id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    navigate('/order');
  };

  return (
    <div className="cart-container">
      <h2>Giỏ hàng của bạn</h2>

      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn hiện tại chưa có sản phẩm nào.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <h3>{item.name}</h3>
              <p>{item.price} VND</p>
              <p>Số lượng: {item.quantity}</p>
              <button
                onClick={() => handleRemove(item.id)}
                className="remove-button"
              >
                Xóa
              </button>
              <button
                onClick={() => handleBuySingle(item)}
                className="buy-now-button"
              >
                Mua ngay
              </button>
            </div>
          ))}

          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleBuyAll} className="buy-now-button">
              Mua ngay tất cả
            </button>
            <button onClick={handleRemoveAll} className="remove-all-button" style={{ marginLeft: 10 }}>
              Xóa tất cả
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
