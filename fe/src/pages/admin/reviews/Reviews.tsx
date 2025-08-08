import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Rate, Space, Popconfirm, Card } from 'antd';
import { FileAddOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useList } from '../../../hooks/useList';
import useCreate from '../../../hooks/useCreate';
import useUpdate from '../../../hooks/useUpdate';
import useRemove from '../../../hooks/useRemove';

const ReviewManager: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editingReview, setEditingReview] = useState<any | null>(null);
    const [form] = Form.useForm();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchText, setSearchText] = useState(searchParams.get('search') || '');

    const { data: reviews, isLoading, error, refetch } = useList('reviews', searchText);

    const addMutation = useCreate('reviews');
    const updateMutation = useUpdate('reviews');
    const removeMutation = useRemove('reviews');

    const handleAdd = () => {
        form.resetFields();
        setIsEdit(false);
        setIsModalOpen(true);
    };

    const handleEdit = (record: any) => {
        setIsEdit(true);
        setEditingReview(record);

        form.setFieldsValue({
            userId: record.user?.id || record.userId,
            productId: record.product?.id || record.productId,
            comment: record.comment,
            rating: record.rating,
        });

        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        removeMutation.mutate(id);
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();

        if (isEdit && editingReview) {
            updateMutation.mutate({ id: editingReview.id, data: values });
        } else {
            addMutation.mutate(values);
        }
        setIsModalOpen(false);
    };

    const handleSearch = () => {
        setSearchParams({ search: searchText });
        refetch();
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 60,
        },
        {
            title: 'Người dùng',
            dataIndex: ['user', 'fullName'],
            render: (text: any) => text || 'Ẩn danh',
        },
        {
            title: 'Sản phẩm',
            dataIndex: ['product', 'name'],
        },
        {
            title: 'Đánh giá',
            dataIndex: 'rating',
            render: (rate: number) => <Rate disabled defaultValue={rate} />,
            // sorter: true,
        },
        {
            title: 'Bình luận',
            dataIndex: 'comment',
        },
        {
            title: 'Thao tác',
            render: (_: any, record: any) => (
                <Space>
                    <Button onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Xác nhận xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card title="Quản lý đánh giá & bình luận">
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <Button type="primary" onClick={handleAdd} icon={<FileAddOutlined />}>Thêm đánh giá</Button>
            </div>
            <Input.Search
                placeholder="Tìm kiếm theo bình luận..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                enterButton
                style={{ maxWidth: 300, marginBottom: 16 }}
            />
            <Table
                dataSource={reviews}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
            />

            <Modal
                title={isEdit ? 'Chỉnh sửa đánh giá' : 'Thêm đánh giá'}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSubmit}
                okText={isEdit ? 'Cập nhật' : 'Thêm'}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="ID người dùng"
                        name="userId"
                        rules={[{ required: true, message: 'Vui lòng nhập ID người dùng' }]}
                    >
                        <Input placeholder="Nhập ID người dùng" />
                    </Form.Item>

                    <Form.Item
                        label="ID sản phẩm"
                        name="productId"
                        rules={[{ required: true, message: 'Vui lòng nhập ID sản phẩm' }]}
                    >
                        <Input placeholder="Nhập ID sản phẩm" />
                    </Form.Item>

                    <Form.Item
                        label="Số sao"
                        name="rating"
                        rules={[{ required: true, message: 'Vui lòng nhập số sao' }]}
                    >
                        <InputNumber min={1} max={5} placeholder="Nhập số sao (1-5)" />
                    </Form.Item>

                    <Form.Item
                        label="Nội dung bình luận"
                        name="comment"
                        rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}
                    >
                        <Input.TextArea placeholder="Nhập nội dung bình luận" rows={4} />
                    </Form.Item>
                </Form>

            </Modal>
        </Card>
    );
};

export default ReviewManager;
