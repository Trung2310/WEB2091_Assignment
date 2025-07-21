// App.tsx
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AdminLayout from './layouts/admin/AdminLayout';
import Dashboard from './pages/admin/dashboard/Dashboard';
import Users from './pages/admin/users/Users';
import Products from './pages/admin/products/Products';
import CategoryManager from './pages/admin/categories/Categories';
import OrderManager from './pages/admin/orders/Orders';
import BrandManager from './pages/admin/brands/Brands';

function App() {
  const router = createBrowserRouter([
    {
      path: '/admin',
      element: <AdminLayout />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'users',
          element: <Users />
        },
        {
          path: 'products',
          element: <Products />
        },
        {
          path: 'categories',
          element: <CategoryManager />
        },
        {
          path: 'brands',
          element: <BrandManager />
        },
        {
          path: 'orders',
          element: <OrderManager />
        }
      ]
    },
    {
      path: '*',
      element: <h1>404 - Not Found</h1>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
