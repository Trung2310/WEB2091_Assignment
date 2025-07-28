import React, { useEffect, useState } from 'react';
import { Typography, Spin, Row, Col } from 'antd';
import Product from '../product/Products';
import bannerImage from './../../../assets/images/banner/sport1.jpg';
import type { Product as ProductData } from '../../../services/ProductService';

const { Title } = Typography;

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3002/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const bannerStyle: React.CSSProperties = {
    backgroundImage: `url(${bannerImage})`,
    height: '400px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  const overlayStyle: React.CSSProperties = {
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
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f9f9f9' }}>
      <div style={bannerStyle}>
        <div style={overlayStyle}>Bùng nổ phong cách thể thao</div>
      </div>

      <section style={{ padding: '40px 32px' }}>
        <Title level={2} style={{ color: '#333' }}>
          Sản phẩm nổi bật
        </Title>

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Spin size="large" />
          </div>
        ) : products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          <Row gutter={[24, 24]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </section>
    </div>
  );
};

export default Home;
