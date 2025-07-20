import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { clientService } from '../../../services/clientService';

const ClientProducts: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await clientService.getProducts();
      setProducts(res);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h2>Danh sách sản phẩm</h2>
      <Table dataSource={products} columns={[
        { title: 'Tên sản phẩm', dataIndex: 'name' },
        { title: 'Giá', dataIndex: 'price' },
        { title: 'Màu sắc', dataIndex: 'color' },
      ]} />
    </div>
  );
};

export default ClientProducts;
