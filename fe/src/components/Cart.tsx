import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  // Load giỏ hàng từ localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  const handleRemoveItem = (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    message.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleCheckout = () => {
    navigate("/checkout"); // Điều hướng đến trang thanh toán
  };

  const columns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Giá', dataIndex: 'price', key: 'price' },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record: CartItem) => (
        <Button danger onClick={() => handleRemoveItem(record.productId)}>
          Xóa
        </Button>
      ),
    },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Giỏ hàng</h2>
      <Table dataSource={cartItems} columns={columns} rowKey="productId" />
      <div style={{ marginTop: 20 }}>
        <h3>Tổng tiền: ${total}</h3>
        <Button type="primary" onClick={handleCheckout}>
          Tiến hành thanh toán
        </Button>
      </div>
    </div>
  );
};

export default Cart;
