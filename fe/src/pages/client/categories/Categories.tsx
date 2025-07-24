import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../../services/CategoryService";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Lấy danh mục từ API
    const fetchCategories = async () => {
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Danh mục sản phẩm</h1>
      <div className="product-list">
        {categories.length === 0 ? (
          <p>Không có danh mục sản phẩm nào.</p>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="category-item">
              <h3>{category.name}</h3>
              <p>{category.description}</p>
              <Link to={`/category/${category.id}`}>
                <button>Chọn danh mục</button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Categories;
