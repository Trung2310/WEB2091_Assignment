import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Typography } from 'antd';
import { categoryService } from '../../../services/CategoryService';

interface Category {
  id: number;
  name: string;
  description?: string;
}

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    const res = await categoryService.getAll();
    setCategories(res);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleDelete = async (id: number) => {
    await categoryService.remove(id);
    fetchCategories();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingCategory) {
      await categoryService.update(editingCategory.id, values);
    } else {
      await categoryService.add(values);
    }
    setIsModalOpen(false);
    fetchCategories();
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography.Title level={2}>📂 Quản lý danh mục</Typography.Title>

      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>Thêm danh mục</Button>
      </div>

      <Table dataSource={categories} rowKey="id" columns={[
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: 'Tên danh mục', dataIndex: 'name' },
        { title: 'Mô tả', dataIndex: 'description' },
        {
          title: 'Thao tác',
          render: (_, record) => (
            <Space>
              <Button onClick={() => handleEdit(record)}>Sửa</Button>
              <Popconfirm title="Xác nhận xóa?" onConfirm={() => handleDelete(record.id)}>
                <Button danger>Xóa</Button>
              </Popconfirm>
            </Space>
          )
        }
      ]} />

      <Modal
        title={isEdit ? 'Sửa danh mục' : 'Thêm danh mục'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
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
    </div>
  );
};

export default CategoryManager;
