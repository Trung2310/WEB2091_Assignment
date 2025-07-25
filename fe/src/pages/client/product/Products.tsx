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
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: 16,
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
      }}
      className="product-item"
      onMouseEnter={(e) => {
        const target = e.currentTarget;
        target.style.transform = 'translateY(-4px)';
        target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget;
        target.style.transform = 'none';
        target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
      }}
    >
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6 }}
      />
      <h3 style={{ marginTop: 12, fontSize: 18, color: '#222' }}>{product.name}</h3>
      <p style={{ color: '#fa541c', fontWeight: 600, fontSize: 16 }}>
        {product.price.toLocaleString('vi-VN')} VND
      </p>
      <Link to={`/product/${product.id}`}>
        <button
          style={{
            marginTop: 12,
            padding: '8px 16px',
            backgroundColor: '#1890ff',
            border: 'none',
            borderRadius: 4,
            color: '#fff',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#40a9ff')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1890ff')}
        >
          Xem chi tiết
        </button>
      </Link>
    </div>
  );
};

export default Product;
