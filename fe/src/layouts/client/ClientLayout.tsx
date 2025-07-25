import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  UserAddOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  BranchesOutlined
} from "@ant-design/icons";
import logo from "../../assets/images/logo/shoes.png";

const { Header, Content } = Layout;

const navItems = [
  { label: "Đăng ký", icon: <UserAddOutlined />, path: "/register" },
  { label: "Đăng nhập", icon: <LoginOutlined />, path: "/login" },
  { label: "Giỏ hàng", icon: <ShoppingCartOutlined />, path: "/cart" }
];

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          position: "sticky",
          top: 0,
          height: 64
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
          <img src={logo} alt="Giày Thể Thao" style={{ height: 40 }} />
          <span style={{
            marginLeft: 10,
            fontWeight: 700,
            fontSize: 22,
            fontFamily: "'Poppins', sans-serif"
          }}>
            <span style={{ color: "#111" }}>S-Space</span>
            <span style={{ color: "#fa541c" }}>Shop</span>
          </span>
        </div>

        {/* Navigation */}
        <nav>
          <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
            {navItems.map((item, index) => (
              <li
                key={index}
                onClick={() => navigate(item.path)}
                style={{
                  marginLeft: 24,
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                  transition: "color 0.3s"
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1890ff")}
                onMouseLeave={e => (e.currentTarget.style.color = "#333")}
              >
                {item.icon}
                <span style={{ marginLeft: 8 }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </Header>

      {/* Content */}
      <Content
        style={{
          padding: "24px",
          overflowY: "auto",
          height: "calc(100vh - 64px)",
          backgroundColor: "#f5f5f5"
        }}
      >
        <header
                style={{
                  background: '#fff',
                  padding: '16px 32px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  position: 'sticky',
                  top: 0,
                  zIndex: 1000,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#222' }}>
                    <span style={{ color: '#1890ff' }}>S</span>-SPACE
                  </h1>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '40%' }}>
                    <Menu
                      mode="horizontal"
                      selectedKeys={[location.pathname]}
                      onClick={(e) => navigate(e.key)}
                      style={{ flex: 1, justifyContent: 'flex-end' }}
                      items={[
                        { key: "/", icon: <DashboardOutlined />, label: "Trang chủ" },
                        { key: "/categories", icon: <ShoppingCartOutlined />, label: "Sản phẩm" },
                        { key: "/about", icon: <MenuFoldOutlined />, label: "Giới thiệu" },
                        { key: "/contact", icon: <BranchesOutlined />, label: "Liên hệ" },
                      ]}
                    />
                  </div>
                </div>
              </header>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ClientLayout;
