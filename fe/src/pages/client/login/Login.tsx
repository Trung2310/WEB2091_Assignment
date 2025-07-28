import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { userService } from '../../../services/UserService';
import { useAuth } from '../../../components/AuthContext';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [error, setError] = useState<string>('');
  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const user: any = await userService.login(email, password);
      return user;
    },
    onSuccess: (user) => {
      if (user) {
        login(user);
        navigate("/");
        if (user?.role === 'customer') {
          navigate('/');
        } else if (user.role === 'admin' || user.role === 'staff') {
          navigate('/admin');
        } else {
          navigate('/login');
        }
      } else {
        setError('Đăng nhập thất bại, vui lòng kiểm tra lại email hoặc mật khẩu');
      }
    },
    onError: () => {
      setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
    },
  });

  const onFinish = (values: { email: string; password: string }) => {
    setError('');
    loginMutation.mutate(values);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "2%" }}>
      <Card style={{ width: 400, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Đăng nhập
        </Title>
        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
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
              loading={loginMutation.isPending}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
