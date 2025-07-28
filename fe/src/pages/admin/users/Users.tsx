import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Input,
  Button,
  Table,
  Modal,
  Form,
  Select,
  message,
  Space,
  Popconfirm,
} from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { userService, type User } from '../../../services/UserService';

const { Option } = Select;

const UserManager: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users', searchText],
    queryFn: () => userService.getAll(searchText),
  });

  const addUserMutation = useMutation({
    mutationFn: (data: Partial<User>) => userService.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === 'users',
      });
      setIsModalOpen(false);
      message.success('Thêm người dùng thành công');
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === 'users',
      });
      setIsModalOpen(false);
      message.success('Cập nhật người dùng thành công');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === 'users',
      });
      message.success('Xóa người dùng thành công');
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
    setIsEdit(false);
    form.resetFields();
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setIsModalOpen(true);
    setIsEdit(true);
    form.setFieldsValue(user);
    setEditingUser(user);
  };

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data: values });
    } else {
      addUserMutation.mutate(values);
    }
  };

  const handleSearch = () => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) && query.queryKey[0] === 'users',
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Mật khẩu',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý người dùng">
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" icon={<UserAddOutlined />} onClick={showModal}>
          Thêm tài khoản
        </Button>
      </div>

      <Input.Search
        placeholder="Tìm kiếm..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onSearch={handleSearch}
        enterButton
        style={{ maxWidth: 300, marginBottom: 16 }}
      />

      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEdit ? 'Cập nhật người dùng' : 'Thêm người dùng'}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fullName"
            label="Tên"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Vui lòng nhập email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: !isEdit,
                message: 'Vui lòng nhập mật khẩu',
              },
            ]}
          >
            <Input.Password
              placeholder={isEdit ? 'Để trống nếu không muốn đổi' : 'Nhập mật khẩu'}
            />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Chọn vai trò' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="customer">Customer</Option>
              <Option value="staff">Staff</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default UserManager;
