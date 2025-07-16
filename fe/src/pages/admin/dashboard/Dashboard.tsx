import React, { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Row, Spin, Statistic } from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null); // State để lưu dữ liệu thống kê
  const [loading, setLoading] = useState<boolean>(true); // Trạng thái tải dữ liệu

  // Hàm lấy dữ liệu thống kê
  useEffect(() => {
    axios.get('http://localhost:3001/stats') // API giả định
      .then((response) => {
        setStats(response.data[0]); // Giả sử API trả về một mảng với một phần tử
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
      })
      .finally(() => {
        setLoading(false); // Kết thúc tải dữ liệu
      });
  }, []);

  // Kiểm tra nếu dữ liệu đang tải
  if (loading) {
    return (
      <div className="container-fluid px-4">
        <Breadcrumb style={{ marginBottom: 16 }}>
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <h2 className="mb-4">Tổng quan</h2>
        <Spin size="large" />
      </div>
    );
  }

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
                <Statistic title="Đã đăng ký" value={stats.newUsers} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Đơn hàng" bordered={false}>
            <div className="d-flex align-items-center">
              <ShoppingCartOutlined style={{ fontSize: 36, marginRight: 16, color: "#52c41a" }} />
              <div>
                <Statistic title="Trong tháng này" value={stats.totalOrders} />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card title="Doanh thu" bordered={false}>
            <div className="d-flex align-items-center">
              <DollarOutlined style={{ fontSize: 36, marginRight: 16, color: "#faad14" }} />
              <div>
                <Statistic title="30 ngày gần đây" value={stats.totalRevenue} precision={2} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
