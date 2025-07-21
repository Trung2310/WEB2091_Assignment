import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, Typography } from 'antd';
import { brandService } from '../../../services/BrandService';

interface Brand {
  id: number;
  name: string;
  origin?: string;
}

const BrandManager: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const fetchBrands = async () => {
    const res = await brandService.getAll();
    setBrands(res);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

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

  const handleDelete = async (id: number) => {
    await brandService.remove(id);
    fetchBrands();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingBrand) {
      await brandService.update(editingBrand.id, values);
    } else {
      await brandService.add(values);
    }
    setIsModalOpen(false);
    fetchBrands();
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography.Title level={2}>Quản lý thương hiệu</Typography.Title>

      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>Thêm thương hiệu</Button>
      </div>

      <Table dataSource={brands} rowKey="id" columns={[
        { title: 'ID', dataIndex: 'id', width: 60 },
        { title: 'Tên thương hiệu', dataIndex: 'name' },
        { title: 'Xuất xứ', dataIndex: 'origin' },
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
        title={isEdit ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
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
    </div>
  );
};

export default BrandManager;
