import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Typography, message, Card } from 'antd';
import useCreate from '../../../hooks/useCreate';
import { useList } from '../../../hooks/useList';
import useUpdate from '../../../hooks/useUpdate';
import useRemove from '../../../hooks/useRemove';
import type { Brand } from '../../../interfaces/brands';

const BrandManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const { data: brands, isLoading, error, refetch, } = useList(`brands`);

  const addMutation = useCreate('brands');
  const updateMutation = useUpdate('brands');
  const removeMutation = useRemove('brands');

  const handleAdd = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Brand) => {
    setIsEdit(true);
    setEditingBrand(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    removeMutation.mutate(id);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    if (isEdit && editingBrand) {
      updateMutation.mutate({ id: editingBrand.id, data: values });
      setIsModalOpen(false);
    } else {
      addMutation.mutate(values);
      setIsModalOpen(false);
    }
  };

  return (
    <Card title="Quản lý thương hiệu" style={{ margin: 20 }}>

      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>Thêm thương hiệu</Button>
      </div>

      <Table
        dataSource={brands}
        loading={isLoading}
        rowKey="id"
        columns={[
          { title: 'ID', dataIndex: 'id', width: 60 },
          { title: 'Tên thương hiệu', dataIndex: 'name' },
          { title: 'Xuất xứ', dataIndex: 'origin' },
          {
            title: 'Thao tác',
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>
                <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
                  <Button danger loading={removeMutation.isPending}>Xóa</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={isEdit ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={addMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên thương hiệu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="origin" label="Xuất xứ">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BrandManager;
