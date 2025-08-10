import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Image, message, Select } from "antd";
import { brandService } from "../../../services/BrandService";

const { Title, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [brand, setBrand] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3002/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
        setSelectedSize(data.size?.[0] || null);
        if (data.brandId) {
          brandService.getById(Number(data.brandId)).then(setBrand);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi fetch dữ liệu sản phẩm:", error);
      });
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      ...product,
      quantity: 1,
      total: product.price,
      size: selectedSize,
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
          size: selectedSize || product.size?.[0],
          color: product.color,
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
        <Paragraph>Thương hiệu: {brand?.name || "Không xác định"}</Paragraph>
        <Paragraph>Xuất xứ: {brand?.origin || "Không có thông tin"}</Paragraph>
        <Paragraph>{product.description}</Paragraph>

        <div style={{ margin: "12px 0" }}>
          <Paragraph strong>Chọn size:</Paragraph>
          <Select
            value={selectedSize}
            onChange={(value) => setSelectedSize(value)}
            style={{ width: 120 }}
          >
            {product.size?.map((s: number) => (
              <Select.Option key={s} value={s}>
                {s}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div style={{ margin: "12px 0" }}>
          <Paragraph strong>Tình trạng:</Paragraph>
          <Paragraph>
            {product.isAvailable ? "Còn hàng" : "Hết hàng"}
          </Paragraph>
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
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
