import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:3001/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} width={300} />
      <p>Giá: {product.price} VND</p>
      <p>Màu sắc: {product.color}</p>
      <p>{product.description}</p>
      <button>Thêm vào giỏ hàng</button>
    </div>
  );
};

export default ProductDetail;
