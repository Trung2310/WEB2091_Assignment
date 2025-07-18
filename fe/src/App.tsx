import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Users from "./pages/admin/users/Users";
import Products from "./pages/admin/products/Products";
import CategoryManager from "./pages/admin/categories/Categories";
import OrderManager from "./pages/admin/orders/Orders";
import BrandManager from "./pages/admin/brands/Brands";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="brands" element={<BrandManager />} />
          <Route path="orders" element={<OrderManager />} />
        </Route>

        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  
  );
};

export default App;
