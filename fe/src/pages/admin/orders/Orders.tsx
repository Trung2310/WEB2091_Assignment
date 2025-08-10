import React from 'react';
import { Table, Tag, Dropdown, Button, message } from 'antd';
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

const statusTranslations: Record<Order['status'], string> = {
  Pending: 'Đang chờ',
  Completed: 'Đã hoàn thành',
  Cancelled: 'Đã hủy',
};

const OrderManager: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getAll,
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
    <Table
      loading={isLoading}
      dataSource={orders}
      rowKey="id"
      columns={[
        { title: 'ID', dataIndex: 'id', width: 60 },
        {
          title: 'Khách hàng',
          dataIndex: 'userId',
          render: (_: string, record: Order) => `[${record.userId}]  ${record.userName}`,
        },
        {
          title: 'Tổng tiền',
          dataIndex: 'total',
          render: (v) => `${new Intl.NumberFormat('vi-VN').format(v)} VND`,
        },
        {
          title: 'Ngày tạo',
          dataIndex: 'createdAt',
          render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          render: (status: Order['status'], record: Order) => {
            const items = statusOptions.map((s) => ({
              key: s,
              label: (
                <Tag color={statusColors[s]}>
                  {statusTranslations[s]}
                </Tag>
              ),
              onClick: () => handleChangeStatus(record.id, s),
            }));

            return (
              <span>
                <Dropdown menu={{ items }} trigger={['click']}>
                  <Button
                    type="text"
                    size="small"
                    icon={<ReloadOutlined />}
                    loading={updateStatusMutation.isPending}
                  />
                </Dropdown>
                <Tag color={statusColors[status]} style={{ marginRight: 8 }}>
                  {statusTranslations[status]}
                </Tag>
              </span>
            );
          },
        },
      ]}
      expandable={{
        expandedRowRender: (record: Order) => (
          <div>
            <h4>Chi tiết đơn hàng {record.id}</h4>
            <ul>
              {record.items.map((item: any) => (
                <li key={item.productId}>
                  {item.name} - {item.quantity} x {item.price.toLocaleString()}₫
                </li>
              ))}
            </ul>
          </div>
        ),
      }}
    />
  );
};

export default OrderManager;
