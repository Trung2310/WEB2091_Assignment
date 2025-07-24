import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import axios from "axios";

const API_URL = 'http://localhost:3002/orders'; 

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  date: string;
  products: { productId: string; quantity: number; size: number }[];
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Lấy dữ liệu từ API
  useEffect(() => {
    axios.get(API_URL)
      .then(response => setOrders(response.data))
      .catch(error => console.error("Error fetching orders", error));
  }, []);

  const handleStatusUpdate = (orderId: string) => {
    // Cập nhật trạng thái đơn hàng (VD: chuyển sang "Đã giao")
    axios.patch(`http://localhost:3002/orders/${orderId}`, { status: "Đã giao" })
      .then(() => {
        message.success("Cập nhật trạng thái đơn hàng thành công");
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: "Đã giao" } : order
        ));
      })
      .catch(() => message.error("Cập nhật trạng thái thất bại"));
  };

  const handleDelete = (orderId: string) => {
    // Xóa đơn hàng
    axios.delete(`http://localhost:3002/orders/${orderId}`)
      .then(() => {
        message.success("Đã xóa đơn hàng");
        setOrders(orders.filter(order => order.id !== orderId));
      })
      .catch(() => message.error("Xóa đơn hàng thất bại"));
  };

  const columns = [
  { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
  { title: "Tên khách hàng", dataIndex: "userId", key: "userId" },
  { title: "Tổng giá trị", dataIndex: "total", key: "total" },
  { title: "Trạng thái", dataIndex: "status", key: "status" },
  {
    title: "Hành động", key: "action", render: (_: undefined, record: Order) => (
      <div>
        <Button onClick={() => handleStatusUpdate(record.id)} disabled={record.status === "Đã giao"}>
          Cập nhật trạng thái
        </Button>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      </div>
    ),
  },
];



  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách đơn hàng</h2>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
      />
    </div>
  );
};

export default OrderList;
