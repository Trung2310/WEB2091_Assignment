import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, message } from "antd";
import axios from "axios";

const API_URL = 'http://localhost:3001/products';

interface Product {
  id: string;
  name: string;
  price: number;
  color: string;
  image: string;
  stock: number;
  size: number[];
  description: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setProducts(response.data))
      .catch(error => console.error("Error fetching products", error));
  }, []);

  const handleAddToCart = (product: Product) => {
    // Thêm vào giỏ hàng (bạn có thể lưu vào localStorage hoặc context API)
    message.success(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách sản phẩm</h2>
      <Row gutter={16}>
        {products.map((product) => (
          <Col span={8} key={product.id} style={{ marginBottom: "20px" }}>
            <Card
              hoverable
              cover={<img alt={product.name} src={product.image} />}
            >
              <Card.Meta title={product.name} description={`Giá: $${product.price}`} />
              <Button
                type="primary"
                style={{ marginTop: "10px" }}
                onClick={() => handleAddToCart(product)}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductList;
