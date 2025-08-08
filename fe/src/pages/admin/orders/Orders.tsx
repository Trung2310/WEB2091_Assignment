import React, { useState } from 'react';
import {
  Table,
  Card,
  Tag,
  Tooltip,
  Button,
  message,
  Dropdown,
  type MenuProps,
  DatePicker,
} from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, type Order } from '../../../services/OrderService';
import dayjs from 'dayjs';

const statusOptions: Order['status'][] = ['Pending', 'Completed', 'Cancelled'];

const statusColors: Record<Order['status'], string> = {
  Pending: 'orange',
  Completed: 'green',
  Cancelled: 'red',
};

const OrderManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => {
      console.log(filters);
      
      return orderService.getAll(filters);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      orderService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      message.success(`Đã cập nhật trạng thái đơn hàng ${id}`);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: () => {
      message.error('Cập nhật thất bại');
    },
  });

  const handleChangeStatus = (id: string, newStatus: Order['status']) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };


  return (
    <Card title="Quản lý đơn hàng" style={{ margin: 20 }}>
      <Table
        loading={isLoading}
        dataSource={orders}
        rowKey="id"
        columns={[
          { title: 'ID', dataIndex: 'id', width: 60 },
          {
            title: 'Khách hàng',
            dataIndex: 'userId',
            render: (_: string, record: Order) =>
              `[${record.userId}]  ${record.userName}`,
          },
          {
            title: 'Tổng tiền',
            dataIndex: 'total',
            render: (v) =>
              `${new Intl.NumberFormat('vi-VN').format(v)} VND`,
          },
          {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
            filteredValue: filters.createdAt ? [filters.createdAt] : null,
            onFilter: (value, record) => {
              if (!value) return true;
              const selectedDate = dayjs(value);
              const recordDate = dayjs(record.createdAt);
              return recordDate.isSame(selectedDate, "day");
            },
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
              <div style={{ padding: 8 }}>
                <DatePicker
                  onChange={(date) => {
                    setSelectedKeys(date ? [date.toISOString()] : []);
                    confirm();
                  }}
                  value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
                  style={{ marginBottom: 8, display: "block" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    type="link"
                    onClick={() => {
                      clearFilters();
                      confirm();
                    }}
                    size="small"
                  >
                    Xóa lọc
                  </Button>
                </div>
              </div>
            ),
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status: Order['status'], record: Order) => {
              const items: MenuProps['items'] = statusOptions.map((s) => ({
                key: s,
                label: (
                  <Tag color={statusColors[s]}>
                    {s.toUpperCase()}
                  </Tag>
                ),
                onClick: () => handleChangeStatus(record.id, s),
              }));

              return (
                <span>
                  <Tag
                    color={statusColors[status]}
                    style={{ marginRight: 8, width: '40%' }}
                  >
                    {status.toUpperCase()}
                  </Tag>
                  <Dropdown menu={{ items }} trigger={['click']}>
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      loading={updateStatusMutation.isPending}
                    />
                  </Dropdown>

                </span>
              );
            },
          },
        ]}
        expandable={{
          expandedRowRender: (record: Order) => (
            <Card type="inner" title=" Chi tiết đơn hàng">
              <Table
                dataSource={record.items}
                rowKey="productId"
                pagination={false}
                size="small"
                onChange={(filters) => {
                  console.log(filters);
                  
                  setFilters(filters);
                }}
                columns={[
                  { title: 'Mã sản phẩm', dataIndex: 'productId' },
                  { title: 'Tên sản phẩm', dataIndex: 'name' },
                  { title: 'Size', dataIndex: 'size' },
                  { title: 'Màu sắc', dataIndex: 'color' },
                  { title: 'Số lượng', dataIndex: 'quantity' },
                  {
                    title: 'Đơn giá',
                    dataIndex: 'price',
                    render: (price: number) =>
                      `${new Intl.NumberFormat('vi-VN').format(price)} VND`,
                  },
                  {
                    title: 'Thành tiền',
                    key: 'total',
                    render: (_, item) =>
                      `${new Intl.NumberFormat('vi-VN').format(
                        item.quantity * item.price
                      )} VND`,
                  },
                ]}
              />
            </Card>
          ),
        }}
      />
    </Card>
  );
};

export default OrderManager;
