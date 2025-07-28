import React, { useEffect, useState } from 'react';
import {
  Table,
  InputNumber,
  Select,
  Button,
  message,
  Divider,
  Typography,
} from 'antd';
import { useAuth } from '../../../components/AuthContext';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title } = Typography;

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('online');
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]').reverse();
    setCart(storedCart);

    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  const saveCart = (data: any[]) => {
    setCart(data);
    localStorage.setItem('cart', JSON.stringify(data));
  };

  const handleQuantityChange = (id: number, quantity: number, price: number) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity, total: quantity * price } : item
    );
    saveCart(newCart);
  };

  const handleSizeChange = (id: number, size: number) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, size } : item
    );
    saveCart(newCart);
  };

  const handleRemove = (id: number) => {
    const newCart = cart.filter(item => item.id !== id);
    saveCart(newCart);
    message.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleRemoveAll = () => {
    saveCart([]);
    setSelectedRowKeys([]);
    message.success('Đã xóa toàn bộ giỏ hàng');
  };

  const handleBuySelected = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm để mua.');
      return;
    }

    const selectedProducts = cart.filter(item => selectedRowKeys.includes(item.id));
    const remainingCart = cart.filter(item => !selectedRowKeys.includes(item.id));

    const newOrder = {
      id: `ORD${Date.now()}`,
      userId: user?.id,
      userName: user?.fullName,
      items: selectedProducts,
      total: selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod,
      createdAt: new Date().toLocaleString(),
    };

    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setOrders(updatedOrders);

    saveCart(remainingCart);
    setSelectedRowKeys([]);
    message.success('Đặt hàng thành công!');
  };

  const cartColumns = [
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'name',
      render: (_: any, item: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 10, border: '1px solid #ccc', borderRadius: 8 }}>
          <div style={{ flex: 1 }}>
            <h4>{item.name}</h4>
            <p>Giá: {item.price.toLocaleString()} VND</p>

            <div>
              <label>Size: </label>
              <Select
                value={item.size}
                onChange={val => handleSizeChange(item.id, val)}
                style={{ width: 100 }}
              >
                {(item.sizeList || []).map((s: any) => (
                  <Option key={s} value={s}>{s}</Option>
                ))}
              </Select>
            </div>

            <div>
              <label>Số lượng: </label>
              <InputNumber
                min={1}
                max={item.stock}
                value={item.quantity || 1}
                onChange={val => handleQuantityChange(item.id, val || 1, item.price)}
              />
              <span style={{ marginLeft: 8, color: '#888' }}>[Còn: {item.stock}]</span>
            </div>
            <p>Thành tiền: {item?.total?.toLocaleString()} VND</p>
          </div>

          <div style={{ marginLeft: 20 }}>
            <img src={item.image} alt={item.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
          </div>
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'action',
      render: (_: any, item: any) => (
        <Button danger onClick={() => handleRemove(item.id)}>
          Xóa
        </Button>
      ),
      width: 80,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  const orderColumns = [
    { title: 'Mã đơn', dataIndex: 'id' },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      render: (v: number) => `${v.toLocaleString()}₫`,
    },
    {
      title: 'Hình thức',
      dataIndex: 'paymentMethod',
      render: (v: string) => (v === 'online' ? 'Online' : 'Tại cửa hàng'),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      render: (value: any) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Giỏ hàng</Title>

      {cart.length === 0 ? (
        <p>Không có sản phẩm nào trong giỏ hàng.</p>
      ) : (
        <>
          <Table
            rowSelection={rowSelection}
            columns={cartColumns}
            dataSource={cart}
            rowKey="id"
            // pagination={false}
            pagination={{pageSize: 3}}
          />

          <div style={{ marginTop: 20 }}>
            <label>Phương thức thanh toán: </label>
            <Select
              value={paymentMethod}
              onChange={setPaymentMethod}
              style={{ width: 200, marginLeft: 10 }}
            >
              <Option value="cod">Thanh toán tại cửa hàng</Option>
              <Option value="online">Thanh toán Online</Option>
            </Select>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <Button type="primary" onClick={handleBuySelected}>
              Mua các sản phẩm đã chọn
            </Button>
            <Button danger onClick={handleRemoveAll}>
              Xóa tất cả
            </Button>
          </div>
        </>
      )}

      <Divider />
      <Title level={4}>Đơn hàng đã đặt</Title>

      {orders.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <Table
          columns={orderColumns}
          dataSource={orders}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default Cart;
