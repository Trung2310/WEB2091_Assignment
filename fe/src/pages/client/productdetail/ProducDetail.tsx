import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Đã thêm vào giỏ hàng!");
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

    // Giả lập lưu đơn hàng vào localStorage (có thể thay đổi sau này)
    const newOrder = {
      id: `ORD${Math.floor(Math.random() * 9000) + 1000}`, // ID đơn hàng ngẫu nhiên
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
      total: product.price,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    navigate("/order");
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} width={300} />
      <p>Giá: {product.price} VND</p>
      <p>Màu sắc: {product.color}</p>
      <p>{product.description}</p>

      <button onClick={handleAddToCart} className="add-to-cart-button">
        Thêm vào giỏ hàng
      </button>

      <button onClick={handleBuyNow} className="buy-now-button">
        Mua ngay
      </button>
    </div>
  );
};

export default ProductDetail;
