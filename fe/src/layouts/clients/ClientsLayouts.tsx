import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, ShoppingCartOutlined, SearchOutlined, UserOutlined, ShoppingOutlined, OrderedListOutlined } from '@ant-design/icons';
import ClientsHeader from './ClientsHeader'; // Import ClientsHeader
import ClientsFooter from './ClientsFooter'; // Import ClientsFooter

const { Header, Sider, Content } = Layout;

const ClientsLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sider for Clients */}
      <Sider breakpoint="lg" collapsedWidth="0">
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          items={[
            { key: '/client/home', icon: <HomeOutlined />, label: 'Trang chủ' },
            { key: '/client/products', icon: <ShoppingCartOutlined />, label: 'Sản phẩm' },
            { key: '/client/search', icon: <SearchOutlined />, label: 'Tìm kiếm' },
            { key: '/client/profile', icon: <UserOutlined />, label: 'Tài khoản' },
            { key: '/client/cart', icon: <ShoppingOutlined />, label: 'Giỏ hàng' }, 
            { key: '/client/checkout', icon: <OrderedListOutlined />, label: 'Thanh toán' }, 
            { key: '/client/orderhistory', icon: <OrderedListOutlined />, label: 'Lịch sử đơn hàng' }, 
            { key: '/client/orderdetails', icon: <OrderedListOutlined />, label: 'Chi tiết đơn hàng' }, 
          ]}
        />
      </Sider>

      {/* Content area */}
      <Layout>
        <ClientsHeader /> {/* Thêm ClientsHeader ở đây */}
        <Content style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
        <ClientsFooter /> {/* Thêm ClientsFooter ở đây */}
      </Layout>
    </Layout>
  );
};

export default ClientsLayout;
