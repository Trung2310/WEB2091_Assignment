import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, Popconfirm } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { Option } from 'antd/es/mentions';
import { FileAddOutlined } from '@ant-design/icons';
import Card from 'antd/es/card/Card';
import { useList } from '../../../hooks/useList';
import useCreate from '../../../hooks/useCreate';
import useUpdate from '../../../hooks/useUpdate';
import useRemove from '../../../hooks/useRemove';
import type { Product } from '../../../interfaces/products';

const ProductManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("search") || "");

  const { data: products, isLoading, error, refetch, } = useList(`products`, searchText);

  const addMutation = useCreate('products');
  const updateMutation = useUpdate('products');
  const removeMutation = useRemove('products');

  const handleAdd = () => {
    form.resetFields();
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Product) => {
    setIsEdit(true);
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      brandId: record.brandId,
      categoryId: record.categoryId,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    removeMutation.mutate(id);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (isEdit && editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: values });
      setIsModalOpen(false);
    } else {
      addMutation.mutate(values);
      setIsModalOpen(false);
    }
  };

  const handleSearch = () => {
    setSearchParams({ search: searchText });
    refetch();
  };

  const { data: brands = [] } = useList("brands");

  const { data: categories = [] } = useList("categories");

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
      render: (price: number) => `${price}`,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      render: (image: string) => (
        <img
          src={image || 'https://picsum.dev/id/1200/300/200'}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://picsum.dev/id/1200/300/200';
          }}
          alt="Ảnh"
          style={{ width: 60, height: 60, objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Thương hiệu',
      dataIndex: ['brand', 'name'],
      key: 'brand',
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
            {brands.map((item) => (
              <Option key={String(item.id)} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        return record.brand?.name === value;
      },
      render: (text: any) => text || '',
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm}: any) => (
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
            {categories.map((item: any) => (
              <Option key={String(item.id)} value={item.name}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        return record.category?.name === value;
      },
      render: (text: any) => text || '',
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

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi khi tải dữ liệu!</p>;

  return (
     <Card title="Quản lý sản phẩm">

      <div style={{ textAlign: 'right', marginBottom: 16 }}>
        <Button type="primary" onClick={handleAdd} icon={<FileAddOutlined/>}>
          Thêm sản phẩm
        </Button>
      </div>
      <Input.Search
              placeholder="Tìm kiếm sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={handleSearch}
              enterButton
              style={{ maxWidth: 300, marginBottom: 16 }}
            />
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        expandable={{
          expandedRowRender: (record: Product) => (
            <div style={{ background: '#f6f6f6', padding: 16 }}>
              <p><strong>Thương hiệu:</strong> [{record.brandId}] {record.brand?.name} </p>
              <p><strong>Danh mục:</strong> [{record.categoryId}] {record.category?.name}</p>
              <p><strong>Kích cỡ:</strong> {record.size?.join(', ')}</p>
              <p><strong>Màu sắc:</strong> {record.color}</p>
              <p><strong>Hình ảnh:</strong> <img src={record.image} alt={record.name} style={{ width: 100 }} /></p>
              <p><strong>Tồn kho:</strong> {record.stock}</p>
              <p><strong>Mô tả:</strong> {record.description}</p>
              <p><strong>Tình trạng:</strong> {record.isAvailable ? 'Còn hàng' : 'Hết hàng'}</p>
            </div>
          ),
          rowExpandable: () => true,
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
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 0, message: 'Giá phải ≥ 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="color"
            label="Màu sắc"
            rules={[{ required: true, message: 'Vui lòng nhập màu sắc' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="brandId"
            label="Thương hiệu"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
          >
            <Select placeholder="Chọn thương hiệu">
              {brands.map((brand: any) => (
                <Select.Option  key={brand.id} value={brand.id}>
                  {brand.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category: any) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="size" label="Kích cỡ (dạng mảng)">
            <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập các size, ví dụ: 38, 39, 40" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Link hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập link hình ảnh' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="stock"
            label="Tồn kho"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng tồn kho' },
              { type: 'number', min: 0, message: 'Tồn kho phải ≥ 0' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="isAvailable"
            label="Còn hàng?"
            rules={[{ required: true, message: 'Vui lòng chọn tình trạng' }]}
          >
            <Select placeholder="Chọn tình trạng">
              <Select.Option value={true}>Còn hàng</Select.Option>
              <Select.Option value={false}>Hết hàng</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      </Card>
  );
};

export default ProductManager;
