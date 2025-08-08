import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Typography, Image, message, Select, List, Rate, Avatar } from "antd";
import useOne from "../../../hooks/useOne";
import { reviewService } from "../../../services/reviewService";
import TextArea from "antd/es/input/TextArea";
import { useList } from "../../../hooks/useList";
import { useQuery } from "@tanstack/react-query";
import useCreate from "../../../hooks/useCreate";

const { Title, Paragraph } = Typography;

const ProductDetail: React.FC = () => {
  const { id }: any = useParams();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: product } = useOne('products', id);

  const user = JSON.parse(localStorage.getItem('user') || 'null')?.user;

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => await reviewService.getByProductId(id)
  })
  const sortedReviews = [...reviews || ''].sort((a, b) => {
    if (a?.user?.id === user.id) return -1; 
    if (b?.user?.id === user.id) return 1; 
    return 0;
  });


  const addMutation = useCreate('reviews');

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    if (product?.size?.length) {
      setSelectedSize(product.size[0]);
    }
  }, [product]);

  if (!product) return <div>Loading...</div>;

  const handleAddToCart = () => {
    if (user) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart.push({
        ...product,
        quantity: 1,
        total: product.price,
        productId: product.id,
        size: selectedSize,
        sizeList: product.size,
        idRow: Date.now(),

      });
      localStorage.setItem("cart", JSON.stringify(cart));
      message.success("Đã thêm vào giỏ hàng!");
    } else {
      message.warning("Bạn cần đăng nhập!!");
    }
  };

  const handleBuyNow = () => {
    navigate('/cart');
    return;
    if (user) {
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
    } else {
      message.warning("Bạn cần đăng nhập!!");
    }
  };

  const averageRating = reviews && reviews.length > 0
    ? (
      reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) /
      reviews.length
    ).toFixed(1)
    : null;

  const handleSubmitReview = async () => {
    if (!user) {
      return message.warning("Bạn cần đăng nhập để đánh giá!");
    }
    if (!comment.trim()) {
      return message.warning("Vui lòng nhập nội dung đánh giá.");
    }

    const newReview = {
      userId: user.id,
      productId: id,
      rating,
      comment,
    };
    addMutation.mutate(newReview);

    setComment("");
    setRating(5);
    message.success("Đã gửi đánh giá!");
  };

  return (
    <div style={{ padding: 24, display: "flex", justifyContent: "center" }}>
      <Card
        style={{ maxWidth: 600, width: "100%" }}
        cover={<Image src={product.image} alt={product.name} />}
      >
        {averageRating && (
          <div style={{ marginBottom: 16 }}>
            <span style={{ marginRight: 8 }}>
              <strong>Đánh giá trung bình:</strong> {averageRating}/5
            </span>
            <Rate disabled allowHalf value={Number(averageRating)} />
          </div>
        )}

        <Title level={2}>{product.name}</Title>
        <Paragraph strong>Giá: {product.price.toLocaleString()} VND</Paragraph>
        <Paragraph>Màu sắc: {product.color}</Paragraph>
        <Paragraph>Thương hiệu: {product.brand?.name || "Không xác định"}</Paragraph>
        <Paragraph>Xuất xứ: {product.brand?.origin || "Không có thông tin"}</Paragraph>
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
        <div style={{ marginTop: 48 }}>
          <Title level={4}>Đánh giá sản phẩm</Title>

          {user && (
            <div style={{ marginBottom: 16 }}>
              <Rate value={rating} onChange={setRating} />
              <TextArea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Nhập đánh giá của bạn..."
                style={{ marginTop: 8 }}
              />
              <Button type="primary" onClick={handleSubmitReview} style={{ marginTop: 8 }}>
                Gửi đánh giá
              </Button>
            </div>
          )}
          <List
            itemLayout="horizontal"
            dataSource={sortedReviews}
            renderItem={(item: any, index: number) => (
              <List.Item
                style={{
                  padding: '16px 12px',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'flex-start',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={48}
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                    />
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h5 style={{ margin: 0, color: (user?.id === item?.userId) ? 'green' : 'gray' }}>{item.user?.fullName || 'Ẩn danh'}{(user?.id === item?.userId) ? '  [Bạn]' : ''}</h5>
                      <Rate disabled value={item.rating} style={{ fontSize: 14 }} />
                    </div>
                  }
                  description={
                    <p style={{ margin: '6px 0 0 0', whiteSpace: 'pre-line', float: "left" }}>
                      {item.comment}
                    </p>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default ProductDetail;
