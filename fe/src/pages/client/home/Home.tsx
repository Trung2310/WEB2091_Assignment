// src/pages/client/Home.tsx
import React, { useEffect, useState } from 'react';
import Product from '../product/Products';
import bannerImage from "./../../../assets/images/banner/sport1.jpg"

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    // Fetch sản phẩm từ API
    fetch('http://localhost:3002/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      {/* Banner */}
      <div className="banner" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="banner-content">
        <button className="cta-button">Khám Phá Ngay</button>
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
    </div>
  );
};

export default Home;
