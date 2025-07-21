import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Select } from "antd";
import { Chart, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import dayjs from "dayjs";
import { orderService } from "../../../services/OrderService";

ChartJS.register(ArcElement, Tooltip, Legend);
const { Option } = Select;

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // 0-indexed

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await orderService.getAll();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const orderDate = dayjs(order.date);
      const matchYear = orderDate.year() === Number(selectedYear);
      const matchMonth = selectedMonth === 0 || (orderDate.month() + 1 === Number(selectedMonth));
      return matchYear && matchMonth;
    });
    setFilteredOrders(filtered);
  }, [orders, selectedYear, selectedMonth]);


  const total = filteredOrders.length;
  const statusCount = {
    Pending: filteredOrders.filter(o => o.status === "Pending").length,
    Completed: filteredOrders.filter(o => o.status === "Completed").length,
    Cancelled: filteredOrders.filter(o => o.status === "Cancelled").length
  };

  const orderData = {
    labels: ["Pending", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Số đơn hàng",
        data: [
          statusCount.Pending,
          statusCount.Completed,
          statusCount.Cancelled
        ],
        backgroundColor: ["#faad14", "#52c41a", "#ff4d4f"],
        borderWidth: 1
      }
    ]
  };

  const years = Array.from({ length: 6 }, (_, i) => 2020 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div>
      <h2>Thống kê đơn hàng</h2>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <span>Năm: </span>
          <Select value={selectedYear} onChange={setSelectedYear} style={{ width: 100 }}>
            {years.map(year => (
              <Option key={year} value={year}>{year}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <span>Tháng: </span>
          <Select value={selectedMonth} onChange={setSelectedMonth} style={{ width: 120 }}>
            <Option value={0}>Tất cả</Option>
            {months.map(month => (
              <Option key={month} value={month}>Tháng {month}</Option>
            ))}
          </Select>

        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng đơn hàng" value={total} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Đơn chờ" value={statusCount.Pending} valueStyle={{ color: "#faad14" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Hoàn tất" value={statusCount.Completed} valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title={`Biểu đồ đơn hàng ${selectedMonth === 0 ? 'năm' : `tháng ${selectedMonth}`} ${selectedYear}`}>
            <Pie data={orderData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
