// src/pages/client/Cart.tsx
import React, { useState, useEffect } from 'react';

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    // Lấy dữ liệu giỏ hàng từ localStorage hoặc API
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const handleRemove = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  return (
    <div>
      <h2>Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn hiện tại chưa có sản phẩm nào.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>{item.price} VND</p>
              <button onClick={() => handleRemove(item.id)}>Xóa</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;
