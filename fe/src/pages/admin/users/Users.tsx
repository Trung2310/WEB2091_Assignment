import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Select } from 'antd';
import api from '../../../configs/api';
import { userService } from '../../../services/UserService';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
}

const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    const res = await userService.getAll();
    setUsers(res);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record: User) => {
    setIsEdit(true);
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await userService.remove(id);
    fetchUsers();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (isEdit && editingUser) {
      await userService.update(editingUser.id, values);
    } else {
      await userService.add(values);
    }

    setIsModalOpen(false);
    fetchUsers();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      render: (active: boolean) => (active ? 'Hoạt động' : 'Ngưng'),
    },
    {
      title: 'Thao tác',
      render: (_: any, record: User) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm
            title="Xác nhận xóa người dùng?"
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
    <div style={{ padding: 20 }}>
      <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Quản lý người dùng</span>
        <Button type="primary" onClick={handleAdd}>
          Thêm người dùng
        </Button>
      </h2>

      <Table dataSource={users} columns={columns} rowKey="id" />

      <Modal
        title={isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={isEdit ? 'Cập nhật' : 'Thêm'}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="fullName" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="admin">Quản trị</Select.Option>
              <Select.Option value="staff">Nhân viên</Select.Option>
              <Select.Option value="user">Người dùng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="isActive" label="Trạng thái">
            <Select>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Ngưng</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManager;
