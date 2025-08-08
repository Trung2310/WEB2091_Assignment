import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Typography, message, Card } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, type Category } from '../../../services/CategoryService';
import useCreate from '../../../hooks/useCreate';
import useUpdate from '../../../hooks/useUpdate';
import { useList } from '../../../hooks/useList';
import useRemove from '../../../hooks/useRemove';

const CategoryManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

   const { data: categories, isLoading, error, refetch, } = useList(`categories`);

  const addMutation = useCreate('categories');
  const updateMutation = useUpdate('categories');
  const removeMutation = useRemove('categories');

  const handleAdd = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Category) => {
    setIsEdit(true);
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    removeMutation.mutate(id);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: values });
      setIsModalOpen(false);
    } else {
      addMutation.mutate(values);
      setIsModalOpen(false);
    }
  };

  return (
    <Card title="Quản lý danh mục" style={{ margin: 20 }}>
      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>Thêm danh mục</Button>
      </div>

      <Table
        dataSource={categories}
        loading={isLoading}
        rowKey="id"
        columns={[
          { title: 'ID', dataIndex: 'id', width: 60 },
          { title: 'Tên danh mục', dataIndex: 'name' },
          { title: 'Mô tả', dataIndex: 'description' },
          {
            title: 'Thao tác',
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>
                <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
                  <Button danger loading={removeMutation.isPending}>Xóa</Button>
                </Popconfirm>
              </Space>
            )
          }
        ]}
      />

      <Modal
        title={isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={addMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryManager;
