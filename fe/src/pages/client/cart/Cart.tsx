import React, { useEffect, useState } from 'react';
import { Table, InputNumber, Select, Button, message, Divider, Typography, Modal, Input, Form, Card, } from 'antd';
import { useAuth } from '../../../components/AuthContext';
import dayjs from 'dayjs';
import { orderService } from '../../../services/OrderService';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const navigate = useNavigate()

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

  const handleQuantityChange = (idRow: any, quantity: number, price: number) => {
    const newCart = cart.map(item =>
      item.idRow === idRow ? { ...item, quantity, total: quantity * price } : item
    );
    saveCart(newCart);
  };

  const handleSizeChange = (id: number, size: number) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, size } : item
    );
    saveCart(newCart);
  };

  const handleRemove = (idRow: number) => {
    const newCart = cart.filter(item => item.idRow !== idRow);
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
    setIsModalOpen(true);
  };

  const duplicateProduct = (idRow: any) => {
    const product = cart.find((item) => item.idRow === idRow);
    if (!product) return message.error('Không tìm thấy sản phẩm để sao chép');

    const duplicated = {
      ...product,
      idRow: Date.now() + Math.floor(Math.random() * 1000),
    };

    const newCart = [duplicated, ...cart];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));

    message.success('Đã tạo bản sao sản phẩm');
  };


  const onModalOk = async () => {
    try {
      const values = await form.validateFields();

      const selectedProducts = cart.filter(item =>
        selectedRowKeys.includes(item?.idRow)
      );

      const newOrder = {
        id: `ORD${Date.now()}`,
        userId: user?.user?.id,
        userName: user?.user?.fullName || '',
        address: values.address,
        note: values.note,
        items: selectedProducts,
        total: selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: values.paymentMethod,
        createdAt: new Date(),
      };

      const updatedOrders = [newOrder, ...orders];
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);

      await orderService.add(newOrder);

      setSelectedRowKeys([]);
      setIsModalOpen(false);
      form.resetFields();

      message.success('Đặt hàng thành công!');
    } catch (err) {
      console.log('Lỗi xác nhận đơn hàng:', err);
    }
  };

  const cartColumns = [
    {
      title: 'Thông tin sản phẩm',
      dataIndex: 'name',
      render: (_: any, item: any) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 10, border: '1px solid #ccc', borderRadius: 8 }}>
          <div style={{ flex: 1 }}>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              size="small"
              onClick={() => duplicateProduct(item.idRow)}
              style={{ position: 'absolute', top: 8, right: 8 }}
            />
            <h4
              onClick={() => navigate(`/products/${item.id}`)}
              style={{ cursor: 'pointer', color: '#1677ff' }}
            >
              {item.name}
            </h4>

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
                onChange={val => handleQuantityChange(item.idRow, val || 1, item.price)}
              />
              <span style={{ marginLeft: 8, color: '#888' }}>[Còn: {item.stock}]</span>
            </div>
            <p>Thành tiền: {item?.total?.toLocaleString()} VND</p>
            <Button danger size="small" icon={<DeleteOutlined />} style={{ position: 'absolute', bottom: 0, right: 0, }} onClick={() => handleRemove(item.idRow)} />
          </div>
          <div style={{ marginLeft: 20 }}>
            <img src={item.image} alt={item.name} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
          </div>
        </div>
      ),
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
      render: (v: string) => (v === 'online' ? 'Thanh toán Online' : 'Thanh toán sau'),
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
            rowKey="idRow"
            pagination={{ pageSize: 3 }}
          />

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
          expandable={{
            expandedRowRender: (record: any) => (
              <Card type="inner" title="Thông tin đơn hàng">
                <Table
                  dataSource={record.items}
                  rowKey="productId"
                  pagination={false}
                  size="small"
                  columns={[
                    { title: 'Sản phẩm', dataIndex: 'name' },
                    { title: 'Size', dataIndex: 'size' },
                    { title: 'Màu sắc', dataIndex: 'color' },
                    { title: 'Số lượng', dataIndex: 'quantity' },
                    {
                      title: 'Đơn giá',
                      dataIndex: 'price',
                      render: (price: number) =>
                        `${new Intl.NumberFormat('vi-VN').format(price)} VND`,
                    },
                    {
                      title: 'Thành tiền',
                      key: 'total',
                      render: (_, item) =>
                        `${new Intl.NumberFormat('vi-VN').format(
                          item.quantity * item.price
                        )} VND`,
                    },
                  ]}
                />
              </Card>
            ),
          }}
        />
      )}

      <Modal
        title="Xác nhận thông tin đơn hàng"
        open={isModalOpen}
        onOk={onModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận đặt hàng"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form} initialValues={{ paymentMethod: 'online' }}>
          <Form.Item
            label="Địa chỉ nhận hàng"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea placeholder="Ví dụ: Giao buổi sáng, gọi trước khi đến..." />
          </Form.Item>

          <Form.Item
            label="Phương thức thanh toán"
            name="paymentMethod"
            rules={[{ required: true, message: 'Chọn phương thức thanh toán' }]}
          >
            <Select>
              <Option value="cod">Thanh toán sau</Option>
              <Option value="online">Thanh toán Online</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cart;
