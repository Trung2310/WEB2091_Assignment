import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./layouts/admin/AdminLayout";
import ClientLayout from "./layouts/client/ClientLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Users from "./pages/admin/users/Users";
import Products from "./pages/admin/products/Products";
import CategoryManager from "./pages/admin/categories/Categories";
import OrderManager from "./pages/admin/orders/Orders";
import BrandManager from "./pages/admin/brands/Brands";

import Home from "./pages/client/home/Home";
import Login from "./pages/client/login/Login";
import Register from "./pages/client/register/Register";
import ProductDetail from "./pages/client/productdetail/ProducDetail";
import Cart from "./pages/client/cart/Cart";
import Order from "./pages/client/order/Order";
import Categories from "./pages/client/categories/Categories";
import ReviewManager from "./pages/admin/reviews/Reviews";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/admin",
      element: (
        <PrivateRoute allowedRoles={["admin", "staff"]}>
          <AdminLayout />
        </PrivateRoute>
      ),
      children: [
        {
          path: "dashboard",
          index: true,
          element: <Dashboard />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "products",
          element: <Products />,
        },
        {
          path: "categories",
          element: <CategoryManager />,
        },
        {
          path: "brands",
          element: <BrandManager />,
        },
        {
          path: "orders",
          element: <OrderManager />,
        },
        {
          path: "reviews",
          element: <ReviewManager />,
        },
      ],
    },
    {
      path: "/",
      element: <ClientLayout />,
      children: [
        {
          path: "",
          element: <Home />
        },
        {
          path: "about",
          element: <Home />
        },
        {
          path: "contact",
          element: <Home />
        },
        {
          path: "login",
          element: <Login />
        },
        {
          path: "register",
          element: <Register />
        },
        {
          path: "products/:id",
          element: <ProductDetail />
        },
        {
          path: "cart",
          element: (
            <PrivateRoute allowedRoles={["customer"]}>
              <Cart />
            </PrivateRoute>
          ),
        },
        {
          path: "order",
          element: (
            <PrivateRoute allowedRoles={["customer"]}>
              <Order />
            </PrivateRoute>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <h1>404 - Not Found</h1>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;