import React, { useState } from "react";
import { Layout, Menu, Popover, Button, Input, Dropdown } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCartOutlined,
  LoginOutlined,
  UserAddOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  BranchesOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logo from "../../assets/images/logo/shoes.png";
import { useAuth } from "../../components/AuthContext";
import { useSearchQuery } from "../../hooks/useSearch";

const { Header, Content } = Layout;

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const user: any = JSON.parse(localStorage.getItem('user') || '{}')?.user;

  const handleLogout = async () => {
    logout();
    // userService.logout();
    localStorage.removeItem("user");
    navigate("/");
  };

  const [searchTerm, setSearchTerm]: any = useState('');

  const [open, setOpen] = useState(false);

  const { data: results = [] } = useSearchQuery("products", searchTerm);

  const items = results?.map((item: any) => ({
    key: item.id,
    label: <div onClick={() => navigate(`/products/${item.id}`)}>
      <img
        src={item.image}
        alt={item.name}
        style={{ width: 50, height: 50, objectFit: "cover", marginRight: 12 }}
      />
      <div>
        <div style={{ fontWeight: 500 }}>{item.name}</div>
        <div style={{ color: "#fa541c" }}>{item.price?.toLocaleString()}₫</div>
      </div>
    </div>,
  })) || [];

  const menu = (
    <Menu
      items={items.length ? items : [{ key: '0', label: '...' }]}
      onClick={(info) => {
        const selected = items.find((item: any) => item.key === info.key);
        if (selected) {
          searchTerm(selected.label);
        }
        setOpen(false);
      }}
    />
  );

  const accountContent = (
    <div style={{ minWidth: 200, textAlign: 'center' }}>
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
    </div>
  );

  const navItems = user
    ? [
      {
        label: (
          <Popover
            placement="bottomRight"
            content={accountContent}
            trigger="click"
          >
            <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <UserOutlined />
              <span style={{ marginLeft: 8 }}>{user ? user.fullName : 'Tài khoản'}</span>
            </div>
          </Popover>
        ),
        key: "account",
      },
      { label: "Giỏ hàng", icon: <ShoppingCartOutlined />, path: "/cart" },
    ]
    : [
      { label: "Đăng ký", icon: <UserAddOutlined />, path: "/register" },
      { label: "Đăng nhập", icon: <LoginOutlined />, path: "/login" },
      { label: "Giỏ hàng", icon: <ShoppingCartOutlined />, path: "/cart" },
    ];

  return (
    <Layout style={{ minHeight: "100vh"}}>
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
          top: '0',
          height: 64,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer"}}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Giày Thể Thao" style={{ height: 40 }} />
          <span style={{ marginLeft: 10, fontWeight: 700, fontSize: 22, textWrap: 'nowrap' }}>
            <span style={{ color: "#111" }}>S-Space</span>
            <span style={{ color: "#fa541c" }}>Shop</span>
          </span>
        </div>
        <div style={{width: '40%', }}>
          <Dropdown
            overlay={menu}
            open={open}
            onOpenChange={(visible: any) => setOpen(visible)}
            trigger={['click']}
          >
            <Input
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOpen(true);
              }}
              onClick={() => setOpen(true)}
            />
          </Dropdown>
        </div>
        <nav>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              margin: 0,
              padding: 0,
              alignItems: "center",
              textWrap: 'nowrap'
            }}
          >
            {navItems.map((item, index) => (
              <li
                key={index}
                onClick={() => item.path && navigate(item.path)}
                style={{
                  marginLeft: 24,
                  fontSize: 16,
                  cursor: item.path ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = item.path ? "#1890ff" : "#333")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#333")
                }
              >
                {item.icon}
                <span style={{ marginLeft: 8 }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>
      </Header>

      <Content
        style={{
          padding: "24px",
          overflowY: "auto",
          height: "calc(100vh - 64px)",
          backgroundColor: "#f5f5f5",
          zIndex: 900,
          scrollbarWidth: 'none'
        }}
      >
        <header
          style={{
            background: "#fff",
            padding: "16px 32px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#222" }}
              onClick={() => navigate("/")}
            >
              <span style={{ color: "#1890ff" }}>S</span>-SPACE
            </h1>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "40%",
              }}
            >
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                onClick={(e) => navigate(e.key)}
                style={{ flex: 1, justifyContent: "flex-end" }}
                items={[
                  {
                    key: "/",
                    icon: <DashboardOutlined />,
                    label: "Trang chủ",
                  },
                  {
                    key: "/categories",
                    icon: <ShoppingCartOutlined />,
                    label: "Sản phẩm",
                  },
                  {
                    key: "/about",
                    icon: <MenuFoldOutlined />,
                    label: "Giới thiệu",
                  },
                  {
                    key: "/contact",
                    icon: <BranchesOutlined />,
                    label: "Liên hệ",
                  },
                ]}
              />
            </div>
          </div>
        </header>

        <Outlet />
        <footer
          style={{
            backgroundColor: '#222',
            color: '#fff',
            padding: '24px 32px',
            textAlign: 'center',
            marginTop: '40px',
          }}
        >
          <p style={{ margin: 0 }}>&copy; 2025 Giày Thể Thao S-SPACE. All Rights Reserved.</p>
          <p style={{ margin: 0 }}>Địa chỉ: Hà Nội - Việt Nam</p>
        </footer>
      </Content>
    </Layout>
  );
};

export default ClientLayout;
