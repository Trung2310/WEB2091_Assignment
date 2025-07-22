// src/pages/client/Product.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="product-item">
      <img src={product.image} alt={product.name} width={150} height={150} />
      <h3>{product.name}</h3>
      <p>{product.price} VND</p>
      <Link to={`/product/${product.id}`}>
        <button>Xem chi tiết</button>
      </Link>
    </div>
  );
};

export default Product;
