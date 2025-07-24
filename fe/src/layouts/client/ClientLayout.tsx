// src/layouts/client/ClientLayout.tsx
import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, ShoppingCartOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo/shoes.png";

const { Header, Sider, Content } = Layout;

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="0" theme="light">
        <div className="logo-container">
          <img src={logo} alt="Giày Thể Thao" className="logo" /> {/* Hiển thị logo giày */}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          items={[
            { key: "/", icon: <HomeOutlined />, label: "Trang chủ" },
            { key: "/cart", icon: <ShoppingCartOutlined />, label: "Giỏ hàng" },
            { key: "/login", icon: <LoginOutlined />, label: "Đăng nhập" },
            { key: "/register", icon: <UserAddOutlined />, label: "Đăng ký" },
          ]}
        />
      </Sider>

      {/* Main content layout */}
      <Layout style={{ width: "100%" }}>
        {/* Header */}
        <Header
          className="bg-light shadow-sm"
          style={{
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            height: 64,
          }}
        >
          <h1 className="mb-0" style={{ margin: "0 auto" }}>
            Giày Thể Thao S-Space
          </h1>
        </Header>

        {/* Content */}
        <Content
          className="p-4"
          style={{
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            scrollbarWidth: "none",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;
