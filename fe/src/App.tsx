import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Users from "./pages/admin/users/Users";
import Products from "./pages/admin/products/Products";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
        </Route>

        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  
  );
};

export default App;
