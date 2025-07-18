import React, { useEffect, useState } from 'react';
import { Table, Typography, Tag, Tooltip, Button, message, Dropdown, type MenuProps } from 'antd';
import { orderService } from '../../../services/OrderService';
import { ReloadOutlined } from '@ant-design/icons';

interface OrderItem {
    productId: string;
    name: string;
    size: number;
    color: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    userId: string;
    userName: string;
    items: OrderItem[];
    total: number;
    status: 'Pending' | 'Completed' | 'Cancelled';
    createdAt: string;
}

const OrderManager: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    const statusOptions: Order["status"][] = ['Pending', 'Completed', 'Cancelled'];

    const statusColors: Record<string, string> = {
        Pending: 'orange',
        Completed: 'green',
        Cancelled: 'red',
    };

    const handleChangeStatus = async (id: string, newStatus: Order['status']) => {
        try {
            await orderService.updateStatus(id, newStatus);
            message.success(`Đã cập nhật trạng thái đơn hàng ${id}`);
            fetchOrders();
        } catch (err) {
            message.error('Cập nhật thất bại');
        }
    };

    const fetchOrders = async () => {
        const res = await orderService.getAll();
        setOrders(res);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: 20 }}>
            <Typography.Title level={2}>📦 Quản lý đơn hàng</Typography.Title>

            <Table dataSource={orders} rowKey="id" columns={[
                { title: 'ID', dataIndex: 'id', width: 60 },
                { title: 'Khách hàng', dataIndex: 'userId', render: (_: string, record: any) => `[${record.userId}]  ${record.userName}` },
                { title: 'Tổng tiền', dataIndex: 'total', render: (v) => `${v} VND` },
                { title: 'Ngày tạo', dataIndex: 'createdAt' },
                {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    render: (status: string, record: Order) => {
                        const items: MenuProps['items'] = statusOptions.map(s => ({
                            key: s,
                            label: (
                                <Tag color={statusColors[s as Order["status"]]}>
                                    {s.toUpperCase()}
                                </Tag>
                            ),
                            onClick: () => handleChangeStatus(record.id, s as Order["status"]),
                        }));

                        return (
                            <span>
                                <Tag color={statusColors[status]} style={{ marginRight: 8 }}>
                                    {status.toUpperCase()}
                                </Tag>
                                <Dropdown menu={{ items }} trigger={['click']}>
                                    <Button type="text" size="small" icon={<ReloadOutlined />} />
                                </Dropdown>
                            </span>
                        );
                    }
                }

            ]}
                expandable={{
                    expandedRowRender: (record: Order) => (
                        <div style={{ background: '#f6f6f6', padding: 16 }}>
                            <Typography.Title level={5}>🛒 Chi tiết đơn hàng</Typography.Title>
                            <Table
                                dataSource={record.items}
                                rowKey="productId"
                                pagination={false}
                                size="small"
                                columns={[
                                    { title: 'Mã sản phẩm', dataIndex: 'productId' },
                                    { title: 'Tên sản phẩm', dataIndex: 'name' },
                                    { title: 'Size', dataIndex: 'size' },
                                    { title: 'Màu sắc', dataIndex: 'color' },
                                    { title: 'Số lượng', dataIndex: 'quantity' },
                                    {
                                        title: 'Đơn giá',
                                        dataIndex: 'price',
                                        render: (price: number) => `${price} VND`,
                                    },
                                    {
                                        title: 'Thành tiền',
                                        key: 'total',
                                        render: (_, item) => `${item.quantity * item.price} VND`,
                                    },
                                ]}
                            />
                        </div>
                    ),
                    rowExpandable: () => true,
                }}

            />
        </div>
    );
};

export default OrderManager;
