import React from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutFormValues {
  fullName: string;
  address: string;
  email: string;
  phone: string;
}

const Checkout: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleSubmit = async (values: CheckoutFormValues) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");

    const order = {
      userId: "1",  // Giả sử người dùng có id = 1
      products: cart,
      total: cart.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0),
      status: "pending",
      date: new Date().toISOString(),
      fullName: values.fullName,  // Thêm tên người dùng vào đơn hàng
      address: values.address,    // Thêm địa chỉ vào đơn hàng
      email: values.email,        // Thêm email vào đơn hàng
      phone: values.phone,        // Thêm số điện thoại vào đơn hàng
    };

    // Giả lập gửi đơn hàng (API gửi đơn hàng thực tế sẽ ở đây)
    console.log("Đơn hàng đã được tạo: ", order);

    // Xóa giỏ hàng sau khi thanh toán
    localStorage.removeItem("cart");

    message.success("Thanh toán thành công, đơn hàng của bạn đang được xử lý.");
    navigate("/admin/orders");  // Điều hướng đến trang quản lý đơn hàng
  };

  return (
    <div>
      <h2>Thông tin thanh toán</h2>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thanh toán
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Checkout;
