import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm, Typography } from 'antd';
import { productService } from '../../../services/ProductService';

interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
  brandId?: number;
  categoryId?: number;
  size?: number[];
  image: string;
  stock?: number;
  description?: string;
  isAvailable?: boolean;
}

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    const res = await productService.getAll();
    setProducts(res);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Product) => {
    setIsEdit(true);
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await productService.remove(id);
    fetchProducts();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingProduct) {
      await productService.update(editingProduct.id, values);
    } else {
      await productService.add(values);
    }
    setIsModalOpen(false);
    fetchProducts();
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      render: (price: number) => `$${price}`,
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (image: string) => (
        <img
          src={`${image}`}
          alt="Ảnh"
          style={{ width: 60, height: 60, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Thao tác',
      render: (_: any, record: Product) => (
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
    <div style={{ padding: 20 }}>
      <Typography.Title level={2} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        🛒 Quản lý sản phẩm
      </Typography.Title>

      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        expandable={{
          expandedRowRender: (record: Product) => (
            <div style={{ background: '#f6f6f6', padding: 16 }}>
              <p><strong>Thương hiệu (brandId):</strong> {record.brandId}</p>
              <p><strong>Danh mục (categoryId):</strong> {record.categoryId}</p>
              <p><strong>Kích cỡ:</strong> {record.size?.join(', ')}</p>
              <p><strong>Hình ảnh:</strong> <img src={record.image} alt={record.name} style={{ width: 100 }} /></p>
              <p><strong>Tồn kho:</strong> {record.stock}</p>
              <p><strong>Mô tả:</strong> {record.description}</p>
              <p><strong>Tình trạng:</strong> {record.isAvailable ? 'Còn hàng' : 'Hết hàng'}</p>
            </div>
          ),
          rowExpandable: (record) => true,
        }}
      />

      <Modal
        title={isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText={isEdit ? 'Cập nhật' : 'Thêm'}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="color" label="Màu sắc" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="brandId" label="Thương hiệu (brandId)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="categoryId" label="Danh mục (categoryId)" rules={[{ required: true }]}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="size" label="Kích cỡ (dạng mảng)">
            <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập các size, ví dụ: 38, 39, 40">
            </Select>
          </Form.Item>

          <Form.Item name="image" label="Link hình ảnh">
            <Input />
          </Form.Item>

          <Form.Item name="stock" label="Tồn kho" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="isAvailable" label="Còn hàng?" valuePropName="checked">
            <Select>
              <Select.Option value={true}>Còn hàng</Select.Option>
              <Select.Option value={false}>Hết hàng</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManager;
