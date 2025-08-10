import React, { useEffect, useState } from 'react';
import { Table, Button, Form, Input, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/AuthContext';
import { cartService } from '../../../services/CartService'; // Giả sử bạn có dịch vụ này

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<any[]>([]); // Giỏ hàng từ Cart và ProductDetail
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal xác nhận đơn hàng
  const [orderDetails, setOrderDetails] = useState<any>(null); // Lưu thông tin đơn hàng đã xác nhận
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy sản phẩm từ localStorage (Cart và ProductDetail)
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const storedProductDetail = JSON.parse(localStorage.getItem('productDetail') || '[]');

    // Ghép các sản phẩm vào giỏ hàng
    const allProducts = [...storedCart, ...storedProductDetail];
    setCart(allProducts);
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning('Giỏ hàng của bạn trống. Vui lòng chọn sản phẩm.');
      return;
    }
    setIsModalOpen(true); // Mở modal xác nhận đơn hàng
  };

  const handleConfirmOrder = (values: any) => {
    // Tạo đơn hàng
    const newOrder = {
      id: `ORD${Date.now()}`,
      userId: user?.id,
      userName: user?.fullName,
      address: values.address,
      phone: values.phone,
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Đang chờ', // Trạng thái đơn hàng là "Đang chờ"
      createdAt: new Date(),
    };

    // Lưu thông tin đơn hàng vào localStorage (hoặc API)
    localStorage.setItem('orders', JSON.stringify([newOrder]));

    // Cập nhật thông tin đơn hàng đã xác nhận
    setOrderDetails(newOrder);

    // Đóng modal và hiển thị thông báo thành công
    setIsModalOpen(false);
    message.success('Đơn hàng đã được xác nhận và đang chờ xử lý!');
  };

  const cartColumns = [
    { title: 'Tên sản phẩm', dataIndex: 'name' },
    { title: 'Giá', dataIndex: 'price' },
    { title: 'Số lượng', dataIndex: 'quantity' },
    { title: 'Thành tiền', dataIndex: 'total' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h3>Thanh toán</h3>
      {cart.length === 0 ? (
        <p>Không có sản phẩm trong giỏ hàng.</p>
      ) : (
        <>
          <Table
            columns={cartColumns}
            dataSource={cart}
            rowKey="idRow"
            pagination={{ pageSize: 3 }}
          />
          <Button
            type="primary"
            onClick={handleCheckout}
            style={{ marginTop: 20 }}
          >
            Xác nhận đơn hàng
          </Button>
        </>
      )}

      <Modal
        title="Xác nhận thông tin đơn hàng"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form onFinish={handleConfirmOrder} layout="vertical">
          <Form.Item
            label="Địa chỉ nhận hàng"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng!' }]}
          >
            <Input.TextArea placeholder="Nhập địa chỉ của bạn" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input placeholder="Nhập số điện thoại của bạn" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Xác nhận đơn hàng
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {orderDetails && (
        <div style={{ marginTop: 40 }}>
          <h4>Thông tin đơn hàng đã xác nhận:</h4>
          <p><strong>Mã đơn hàng:</strong> {orderDetails.id}</p>
          <p><strong>Tên người mua:</strong> {orderDetails.userName}</p>
          <p><strong>Địa chỉ nhận hàng:</strong> {orderDetails.address}</p>
          <p><strong>Số điện thoại:</strong> {orderDetails.phone}</p>
          <p><strong>Trạng thái:</strong> {orderDetails.status}</p>
          <p><strong>Tổng tiền:</strong> {orderDetails.total.toLocaleString()} VND</p>
        </div>
      )}
    </div>
  );
};

export default Checkout;
