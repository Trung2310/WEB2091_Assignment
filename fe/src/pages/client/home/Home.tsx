import React, { useEffect, useState } from 'react';
import Product from '../product/Products';
import bannerImage from './../../../assets/images/banner/sport1.jpg';
import { Menu } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import { BranchesOutlined, DashboardOutlined, MenuFoldOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3002/products')
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9f9f9' }}>
      {/* Header */}
      {/* <header
        style={{
          background: '#fff',
          padding: '16px 32px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#222' }}>
            <span style={{ color: '#1890ff' }}>S</span>-SPACE
          </h1>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '40%' }}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              onClick={(e) => nav(e.key)}
              style={{ flex: 1, justifyContent: 'flex-end' }}
              items={[
                { key: "/", icon: <DashboardOutlined />, label: "Trang chủ" },
                { key: "/categories", icon: <ShoppingCartOutlined />, label: "Sản phẩm" },
                { key: "/about", icon: <MenuFoldOutlined />, label: "Giới thiệu" },
                { key: "/contact", icon: <BranchesOutlined />, label: "Liên hệ" },
              ]}
            />
          </div>
        </div>
      </header> */}

      {/* Banner */}
      <div
        style={{
          backgroundImage: `url(${bannerImage})`,
          height: '400px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          Bùng nổ phong cách thể thao
        </div>
      </div>

      {/* Featured Products */}
      <section style={{ padding: '40px 32px' }}>
        <h2 style={{ fontSize: 28, marginBottom: 24, color: '#333' }}>Sản phẩm nổi bật</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
          }}
        >
          {products.length === 0 ? (
            <p>Không có sản phẩm nào.</p>
          ) : (
            products.map((product) => (
              <Product key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#222',
          color: '#fff',
          padding: '24px 32px',
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        <p style={{ margin: 0 }}>&copy; 2025 Giày Thể Thao S-SPACE. All Rights Reserved.</p>
        <p style={{ margin: 0 }}>Địa chỉ: Hà Nội - Việt Nam</p>
      </footer>
    </div>
  );
};

export default Home;
