import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "./layouts/admin/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Users from "./pages/admin/users/Users";
import Products from "./pages/admin/products/Products";
<<<<<<< Updated upstream
=======
import CategoryManager from "./pages/admin/categories/Categories";
import OrderManager from "./pages/admin/orders/Orders";
import BrandManager from "./pages/admin/brands/Brands";
import ClientsLayout from "./layouts/clients/ClientsLayouts";
import Home from "./pages/clients/home/Home";
import ClientProducts from "./pages/clients/products/Products";
import Search from "./pages/clients/search/Search";
import Profile from "./pages/clients/profile/Profile";
import Cart from "./pages/clients/cart/Cart";
import Checkout from "./pages/clients/checkout/Checkout";
import OrderHistory from "./pages/clients/orderhistory/OrderHistory";
import OrderDetails from "./pages/clients/orderdetails/OrderDetails";

>>>>>>> Stashed changes

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
        </Route>

        <Route path="/client" element={<ClientsLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="products" element={<ClientProducts />} />
          <Route path="search" element={<Search />} />
          <Route path="profile" element={<Profile />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="order-details/:orderId" element={<OrderDetails />} />
        </Route>

        <Route path="*" element={<h1>404 - Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
