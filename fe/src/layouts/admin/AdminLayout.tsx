import React from "react";
import { Layout, Menu, Button, Popover, Breadcrumb, Tooltip } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  MenuFoldOutlined,
  BranchesOutlined,
  OrderedListOutlined,
  CommentOutlined,
  LogoutOutlined,
  CaretLeftOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../components/AuthContext";

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const user = JSON.parse(localStorage.getItem("user") || "{}")?.user || {};

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const pathSnippets = location.pathname.split("/").filter(i => i);
  const pathNameMap: { [key: string]: string } = {
    dashboard: "Dashboard",
    users: "Người dùng",
    products: "Sản phẩm",
    detail: "Chi tiết",
    categories: "Danh mục",
    brands: "Thương hiệu",
    orders: "Đơn hàng",
    reviews: "Đánh giá",
    admin: "Quản trị"
  };

  const breadcrumbItems = pathSnippets.map((snippet, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      title: <a onClick={() => navigate(url)}>{pathNameMap[snippet] || snippet}</a>,
      key: url,
    };
  });


  return (
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
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
            { key: "/admin/categories", icon: <MenuFoldOutlined />, label: "Danh mục" },
            { key: "/admin/brands", icon: <BranchesOutlined />, label: "Thương hiệu" },
            { key: "/admin/orders", icon: <OrderedListOutlined />, label: "Đơn hàng" },
            { key: "/admin/reviews", icon: <CommentOutlined />, label: "Đánh giá" },
          ]}
        />
      </Sider>

      <Layout style={{ width: "100%" }}>
        <Header
          className="bg-light shadow-sm d-flex justify-content-between align-content-center px-4"
          style={{ height: 64 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Tooltip title="Quay lại">
              <Button
                onClick={() => navigate(-1)}
                icon={<CaretLeftOutlined />}
              />
            </Tooltip>
            <div>
              <h4 className="mb-0 mt-2">Quản trị hệ thống</h4>
              <Breadcrumb
                items={breadcrumbItems}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Popover
              placement="bottomRight"
              content={<div style={{ minWidth: 200, textAlign: 'center' }}>
                <img
                  src="https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif"
                  alt="avatar"
                  style={{ width: 64, height: 64, borderRadius: '50%', marginBottom: 12 }}
                />
                <p><strong>{user?.fullName}</strong></p>
                <p style={{ marginBottom: 12 }}>{user?.email}</p>
                <p>ID: {user?.id}</p>
                <Button icon={<LogoutOutlined />} danger block onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>}
              trigger="click"
            >
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <UserOutlined />
                <span style={{ marginLeft: 8 }}>{user ? user.fullName : 'Tài khoản'}</span>
              </div>
            </Popover>
            <Tooltip title="Tiến lên">
              <Button
                onClick={() => navigate(1)}
                icon={<CaretRightOutlined />}
              />
            </Tooltip>
          </div>
        </Header>

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

export default AdminLayout;
