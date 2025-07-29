import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Image, message } from "antd";

const { Title, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3002/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu sản phẩm:", error);
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({...product,
      quantity: 1,
      total: product.price,
      size: product.size[0],
      sizeList: product.size,
      idRow: Date.now(),
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    message.success("Đã thêm vào giỏ hàng!");
  };

  const handleBuyNow = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    localStorage.setItem("cart", JSON.stringify(cart));

    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 9000) + 1000}`,
      userId: "USR123",
      userName: "Nguyễn Văn A",
      items: [
        {
          productId: product.id,
          name: product.name,
          size: 42,
          color: "Black/White",
          quantity: 1,
          price: product.price,
        },
      ],
      total: product.price || 10,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    navigate("/order");
  };

  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <Card
        style={{ maxWidth: 600, width: "100%" }}
        cover={<Image src={product.image} alt={product.name} />}
      >
        <Title level={2}>{product.name}</Title>
        <Paragraph strong>Giá: {product.price.toLocaleString()} VND</Paragraph>
        <Paragraph>Màu sắc: {product.color}</Paragraph>
        <Paragraph>{product.description}</Paragraph>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Button type="primary" onClick={handleAddToCart}>
            Thêm vào giỏ hàng
          </Button>
          <Button danger onClick={handleBuyNow}>
            Mua ngay
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
