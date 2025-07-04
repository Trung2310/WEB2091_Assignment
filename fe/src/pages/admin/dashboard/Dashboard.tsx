import React from "react";
import { Breadcrumb, Card, Col, Row } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const Dashboard: React.FC = () => {
  return (
    <div className="container-fluid px-4">
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      <h2 className="mb-4">Tổng quan</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <Card title="Người dùng" bordered={false}>
            <div className="d-flex align-items-center">
              <UserOutlined style={{ fontSize: 36, marginRight: 16, color: "#1890ff" }} />
              <div>
                <h4 className="mb-0">1,200</h4>
                <small>Đã đăng ký</small>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Đơn hàng" bordered={false}>
            <div className="d-flex align-items-center">
              <ShoppingCartOutlined style={{ fontSize: 36, marginRight: 16, color: "#52c41a" }} />
              <div>
                <h4 className="mb-0">350</h4>
                <small>Trong tháng này</small>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Doanh thu" bordered={false}>
            <div className="d-flex align-items-center">
              <DollarOutlined style={{ fontSize: 36, marginRight: 16, color: "#faad14" }} />
              <div>
                <h4 className="mb-0">150,000,000₫</h4>
                <small>30 ngày gần đây</small>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
