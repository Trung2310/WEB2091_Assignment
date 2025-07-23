import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Typography, message, Card } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService, type Category } from '../../../services/CategoryService';

const CategoryManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  const addMutation = useMutation({
    mutationFn: categoryService.add,
    onSuccess: () => {
      message.success('Đã thêm danh mục');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Category> }) =>
      categoryService.update(id, data),
    onSuccess: () => {
      message.success('Đã cập nhật danh mục');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: () => {
      message.success('Đã xóa danh mục');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

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
    deleteMutation.mutate(id);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: values });
    } else {
      addMutation.mutate(values);
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
                  <Button danger loading={deleteMutation.isPending}>Xóa</Button>
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
