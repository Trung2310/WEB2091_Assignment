import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();  

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);


  const handleRemove = (productId: string) => {
    const updatedCart = cart.filter(item => item.id !== productId); 
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); 
  };


  const handleRemoveAll = () => {
    setCart([]);  
    localStorage.setItem('cart', JSON.stringify([]));  
  };

  // Hàm chuyển hướng người dùng đến trang đơn hàng
  const handleBuyNow = () => {
    const orderItems = cart.map((item) => ({
      productId: item.id,
      name: item.name,
      size: item.size || 42,  // Giả sử size mặc định là 42
      color: item.color || 'Black/White',  // Màu sắc mặc định
      quantity: item.quantity,
      price: item.price,
    }));

    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 9000) + 1000}`,  // ID đơn hàng ngẫu nhiên
      userId: 'USR123',  // Giả sử ID người dùng
      userName: 'Nguyễn Văn A',
      items: orderItems,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),  // Tổng tiền
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(newOrder);  
    localStorage.setItem('orders', JSON.stringify(orders));

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
              <button onClick={() => handleRemove(item.id)} className="remove-button">Xóa</button>
              <button onClick={handleBuyNow} className="buy-now-button">
                Mua ngay
              </button>
            </div>
          ))}
        </div>
      )}
      {cart.length > 0 && (
        <button onClick={handleBuyNow} className="buy-now-button">
          Mua ngay tất cả
        </button>
      )}

      {cart.length > 0 && (
        <button onClick={handleRemoveAll} className="remove-all-button">
          Xóa tất cả
        </button>
      )}
    </div>
  );
};

export default Cart;
