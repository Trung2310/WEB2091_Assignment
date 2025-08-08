import React, { useState } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthen } from '../../../hooks/useAuthen';

const { Title } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const nav = useNavigate();
  const authMutation = useAuthen('register');

  const onFinish = (values: { fullName: string; email: string; password: string }) => {
    authMutation.mutate(values);
    // form.resetFields();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: "2%" }}>
      <Card style={{ width: 450, padding: 24 }}>
        <Title level={3} style={{ textAlign: 'center' }}>Đăng ký tài khoản</Title>
        {authMutation.isError && (
          <Alert
            type="error"
            message={authMutation.error instanceof Error ? authMutation.error.message : "Có lỗi xảy ra"}
            style={{ marginBottom: 16 }}
          />
        )}
        {authMutation.isSuccess && (
          <Alert
            type="success"
            message="Thao tác thành công"
            style={{ marginBottom: 16 }}
          />
        )}
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
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={authMutation.isPending}
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
