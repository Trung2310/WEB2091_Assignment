// src/pages/client/Home.tsx
import React, { useEffect, useState } from 'react';
import  Product  from '../product/Products'; 

const Home: React.FC = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Sản phẩm nổi bật</h1>
      <div className="product-list">
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
