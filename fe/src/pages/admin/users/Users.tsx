import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Input, Button, Table, Modal, Form, Select, Collapse, message } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { userService, type User } from '../../../services/UserService';

const { Panel } = Collapse;
const { Option } = Select;

// interface User {
//   id: string;
//   fullName: string;
//   email: string;
//   role: 'admin' | 'staff' | 'user';
//   isActive: boolean;
// }

const UserManager: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');
  const [activeKey, setActiveKey] = useState<string | string[]>();

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users', searchText],
    queryFn: () => userService.getAll(searchText),
  });

  const addUserMutation = useMutation({
    mutationFn: (data: Partial<User>) => userService.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      userService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => userService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
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
    Modal.confirm({
      title: 'Xác nhận xoá',
      content: 'Bạn có chắc muốn xoá người dùng này?',
      okText: 'Xoá',
      cancelText: 'Huỷ',
      onOk: () => deleteUserMutation.mutate(id),
    });
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
    queryClient.invalidateQueries({ queryKey: ['users'] });
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
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: User) => (
        <>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Sửa
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>
            Xoá
          </Button>
        </>
      ),
    },
  ];

  return (
    <Card title="Quản lý người dùng">
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={showModal}>
          Thêm sản phẩm
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
          <Form.Item name="fullName" label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Chọn vai trò' }]}>
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
