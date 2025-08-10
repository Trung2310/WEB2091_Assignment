import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  MenuFoldOutlined,
  BranchesOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh", width: '100%' }}>
      {/* Menu bên trái */}
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="text-white text-center py-3 fs-5 fw-bold">Admin Panel</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          items={[
            { key: "/admin/users", icon: <UserOutlined />, label: "Người dùng" },
            { key: "/admin/products", icon: <ShoppingCartOutlined />, label: "Sản phẩm" },
            { key: "/admin/categories", icon: <MenuFoldOutlined />, label: "Danh mục" },
            { key: "/admin/brands", icon: <BranchesOutlined />, label: "Thương hiệu" },
            { key: "/admin/orders", icon: <OrderedListOutlined />, label: "Đơn hàng" },
          ]}
        />
      </Sider>

      {/* Phần bên phải gồm Header + Content */}
      <Layout style={{ width: "100%" }}>
        <Header
          className="bg-light shadow-sm"
          style={{
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            height: 64,
          }}
        >
          <h5 className="mb-0" style={{ margin: "0 auto" }}>Admin Control</h5>
        </Header>

        <Content className="p-4" style={{
          overflowY: "auto", height: "calc(100vh - 64px)", scrollbarWidth: "none"
        }}>

          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
