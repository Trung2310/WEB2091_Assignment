import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../../services/CategoryService";
import { productService } from "../../../services/ProductService";
import { Button, Card, Col, Row, Typography } from "antd";
const { Title, Text } = Typography;
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

interface CategoryWithProducts {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categoryList = await categoryService.getAll();
      const categoriesWithProducts = await Promise.all(
        categoryList.map(async (cat: any) => {
          const products = await productService.getByCategory(cat.id, 3);
          return { ...cat, products };
        })
      );
      setCategories(categoriesWithProducts);
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "32px" }}>
      <Title level={2} style={{ marginBottom: 24 }}>
        Danh mục sản phẩm
      </Title>

      {categories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: "48px" }}>
          <Card
            key={cat.id}
            title={
              <Row justify="space-between" align="middle" style={{ width: "100%" }}>
                <Title level={4} style={{ margin: 0 }}>
                  {cat.name}
                </Title>
                <Link to={`/category/${cat.id}`}>
                  <Button type="link">Xem thêm →</Button>
                </Link>
              </Row>
            }
            style={{ marginBottom: 32 }}
          >
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {cat.products.length > 0 ? (
                cat.products.map((product, index) => (
                  <>
                    <Col xs={24} sm={12} md={8} lg={7} key={product.id}>
                      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
                        <Card
                          hoverable
                          cover={
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{ height: 180, objectFit: "cover" }}
                            />
                          }
                        >
                          <Title level={5}>{product.name}</Title>
                          <Text type="success">
                            {product.price.toLocaleString()}₫
                          </Text>
                        </Card>
                      </Link>
                    </Col>
                    {index === 2 && (
                      <Col xs={24} sm={12} md={8} lg={1}>
                        <Card
                          // style={{ border: "1px dashed #aaa", }}
                          hoverable
                          cover={
                            <div style={{
                              height: '180px',
                              backgroundColor: '#f5f5f5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'gray',
                              fontSize: '18px',
                              // border: "1px dashed #aaa"
                            }}>
                              ...
                            </div>
                          }
                        />
                      </Col >
                    )}

                  </>
                ))) : (
                <div
                  style={{
                    border: "1px dashed #aaa",
                    borderRadius: 8,
                    padding: 10,
                    width: "30%",
                    minWidth: 200,
                    textAlign: "center",
                    color: "#888"
                  }}
                >
                  <p>Đang cập nhật...</p>
                </div>
              )}
            </div>
          </Card>
        </div >
      ))}
    </div >
  );
};

export default Categories;
