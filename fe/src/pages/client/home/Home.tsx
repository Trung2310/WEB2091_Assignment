import React, { useEffect, useState } from 'react';
import Product from '../product/Products';
import bannerImage from "./../../../assets/images/banner/sport1.jpg";

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    fetch('http://localhost:3002/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="navbar">
          <ul>
            <li><a href="/">Trang chủ</a></li>
            <li><a href="/categories">Sản phẩm</a></li>
            <li><a href="/about">Giới thiệu</a></li>
            <li><a href="/contact">Liên hệ</a></li>
          </ul>
        </nav>
        <h1 className="site-title">S-SPACE</h1>
      </header>

      {/* Banner */}
      <div className="banner" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="banner-content">
        </div>
      </div>

      <h1>Sản phẩm nổi bật</h1>
      <div className="product-list">
        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          products.map((product) => (
            <Product key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Giày Thể Thao S-Space. All Rights Reserved.</p>
          <p>Địa chỉ: Hà Nội - Việt Nam</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
