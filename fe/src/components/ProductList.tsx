import React, { useEffect, useState } from 'react';
import { Table, Button, Row, Col, Input, message } from 'antd';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
  image: string;
  stock: number;
  size: number[];
  description: string;
  isAvailable: boolean;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); 
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false); 

  // Hàm lấy sản phẩm từ API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3002/products');
      setProducts(res.data);
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải sản phẩm');
      console.error(error);  // Đảm bảo lỗi được log ra console
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); 
  }, []);

  // Hàm xử lý sự kiện thay đổi trong ô tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Hàm xử lý khi nhấn vào nút thêm vào giỏ hàng
  const handleAddToCart = (e: React.MouseEvent<HTMLElement, MouseEvent>, product: Product) => {
    e.preventDefault(); // Ngừng hành động mặc định
    message.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  // Lọc sản phẩm theo từ khóa tìm kiếm
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      render: (image: string) => <img src={image} alt="Ảnh" style={{ width: 60, height: 60, objectFit: 'cover' }} />,
    },
    {
      title: 'Thao tác',
      render: (_: Product) => (  // Sửa _ thành kiểu Product
        <Button onClick={(e) => handleAddToCart(e, _)} disabled={_.stock <= 0}>
          {_.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Danh sách sản phẩm</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={handleSearchChange}
            allowClear
          />
        </Col>
      </Row>

      <Table
        dataSource={filteredProducts}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default ProductList;
