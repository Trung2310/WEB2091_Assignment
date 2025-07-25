import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../../services/CategoryService";
import { productService } from "../../../services/ProductService";

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
      <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>
        Danh mục sản phẩm
      </h2>

      {categories.map((cat) => (
        <div key={cat.id} style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}
          >
            <h3 style={{ fontSize: "22px", fontWeight: "600", margin: 0 }}>{cat.name}</h3>
            <Link to={`/category/${cat.id}`} style={{ color: "#007bff", textDecoration: "none" }}>
              Xem thêm →
            </Link>
          </div>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {cat.products.length > 0 ? (
              cat.products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 10,
                    width: "30%",
                    minWidth: 200
                  }}
                >
                  <div
                    style={{
                      width: "auto",
                      aspectRatio: "4 / 3",
                      overflow: "hidden",
                      borderRadius: 8
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                      }}
                    />
                  </div>

                  <h4 style={{ fontSize: 16, marginTop: 10 }}>{product.name}</h4>
                  <p style={{ color: "green" }}>{product.price.toLocaleString()}₫</p>
                </div>
              ))
            ) : (
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
        </div>
      ))}
    </div>
  );
};

export default Categories;
