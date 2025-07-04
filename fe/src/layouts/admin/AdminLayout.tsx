import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
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
            { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
            { key: "/admin/users", icon: <UserOutlined />, label: "Người dùng" },
            { key: "/admin/products", icon: <ShoppingCartOutlined />, label: "Sản phẩm" },
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
          <h5 className="mb-0" style={{ margin: "0 auto" }}>Quản trị hệ thống</h5>
        </Header>

        <Content className="p-4">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
