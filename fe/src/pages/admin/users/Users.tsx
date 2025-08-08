import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Card,
  Input,
  Button,
  Table,
  Modal,
  Form,
  Select,
  Space,
  Popconfirm,
} from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useList } from '../../../hooks/useList';
import useCreate from '../../../hooks/useCreate';
import useUpdate from '../../../hooks/useUpdate';
import useRemove from '../../../hooks/useRemove';

const { Option } = Select;

const UserManager: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [searchText, setSearchText] = useState('');

  const { data: users } = useList(`users`, searchText);

  const addMutation = useCreate('users');
  const updateMutation = useUpdate('users');
  const removeMutation = useRemove('users');
  const roleUser = [{'role': 'admin'}, {'role': 'staff'}, {'role': 'customer'}];

  const showModal = () => {
    setIsModalOpen(true);
    setIsEdit(false);
    form.resetFields();
    setEditingUser(null);
  };

  const handleEdit = (user: any) => {
    setIsModalOpen(true);
    setIsEdit(true);
    form.setFieldsValue(user);
    setEditingUser(user);
  };

  const handleDelete = (id: string) => {
    removeMutation.mutate(id);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: values });
      setIsModalOpen(false);
    } else {
      addMutation.mutate(values);
      setIsModalOpen(false);
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
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => (
        <div style={{ padding: 8 }}>
          <Select
            value={selectedKeys[0]}
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              confirm();
            }}
            style={{ width: 200 }}
            defaultValue={''}
          >
            <Option value="">Tất cả</Option>
            {roleUser.map((item: any) => (
              <Option key={String(item.role)} value={item.role}>
                {item.role}
              </Option>
            ))}
          </Select>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        return record?.role === value;
      },
      render: (text: any) => text || '',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
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
