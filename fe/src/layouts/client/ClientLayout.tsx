import React from "react";
import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { ShoppingCartOutlined, LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import logo from "../../assets/images/logo/shoes.png";

const { Header, Content } = Layout;

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        className="bg-light shadow-sm"
        style={{
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: 64,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <div className="logo-container">
          <img src={logo} alt="Giày Thể Thao" className="logo" />
        </div>
        <nav className="navbar">
          <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
            <li style={{ margin: "0 15px", fontSize: "18px", cursor: "pointer" }} onClick={() => navigate("/register")}>
              <UserAddOutlined style={{ marginRight: "8px" }} />
              Đăng ký
            </li>
            <li style={{ margin: "0 15px", fontSize: "18px", cursor: "pointer" }} onClick={() => navigate("/login")}>
              <LoginOutlined style={{ marginRight: "8px" }} />
              Đăng nhập
            </li>
            <li style={{ margin: "0 15px", fontSize: "18px", cursor: "pointer" }} onClick={() => navigate("/cart")}>
              <ShoppingCartOutlined style={{ marginRight: "8px" }} />
              Giỏ hàng
            </li>
          </ul>
        </nav>
      </Header>

      {/* Content */}
      <Content
        className="p-4"
        style={{
          overflowY: "auto",
          height: "calc(100vh - 64px)",
          scrollbarWidth: "none",
          padding: "20px"
        }}
      >
        <Outlet />
      </Content>
    </Layout>
  );
};

export default ClientLayout;
