import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { userService } from '../../../services/UserService';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();

  const registerMutation = useMutation({
    mutationFn: (data: { fullName: string; email: string; password: string }) =>
      userService.add({ ...data, role: 'customer', isActive: true }),
    onSuccess: () => {
      setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
      setError('');
      form.resetFields();
    },
    onError: () => {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      setSuccess('');
    },
  });

  const onFinish = (values: { fullName: string; email: string; password: string }) => {
    setError('');
    setSuccess('');
    registerMutation.mutate(values);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "2%" }}>
      <Card style={{ width: 450, padding: 24 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Đăng ký tài khoản</Title>

        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
        {success && <Alert type="success" message={success} style={{ marginBottom: 16 }} />}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={registerMutation.isPending}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
  <span>Đã có tài khoản? </span>
  <Button type="link" onClick={() => nav('/login')}>
    Đăng nhập
  </Button>
</div>

      </Card>
    </div>
  );
};

export default Register;
