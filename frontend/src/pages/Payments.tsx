import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Row, Col, message } from 'antd';
import { FileTextOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';
import type { Payment } from '../types';

const Payments: React.FC = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadPayments();
    }, []);

    const loadPayments = async () => {
        setLoading(true);
        try {
            const data = await paymentService.getAllPayments();
            setPayments(data);
        } catch (error) {
            message.error('Ошибка загрузки платежей');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusTag = (status: string) => {
        const statusConfig: Record<string, { color: string; text: string }> = {
            PENDING: { color: 'orange', text: 'Ожидание' },
            COMPLETED: { color: 'green', text: 'Завершен' },
            FAILED: { color: 'red', text: 'Ошибка' },
            CANCELLED: { color: 'default', text: 'Отменен' },
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const getTypeText = (type: string) => {
        const typeMap: Record<string, string> = {
            STATE_FEE: 'Госпошлина',
            FINE: 'Штраф',
            OTHER: 'Другое',
        };
        return typeMap[type] || type;
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ marginBottom: 16 }}>Платежи</h1>
                <Row gutter={16}>
                    <Col span={6}>
                        <Card
                            hoverable
                            onClick={() => navigate('/payments/create')}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            <FileTextOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: 12 }} />
                            <div style={{ fontSize: '16px', fontWeight: 500 }}>Обычная оплата</div>
                            <div style={{ color: '#8c8c8c', marginTop: 4 }}>Создание единичного платежа</div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card
                            hoverable
                            onClick={() => navigate('/payments/create-mass')}
                            style={{ cursor: 'pointer', textAlign: 'center' }}
                        >
                            <CopyOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: 12 }} />
                            <div style={{ fontSize: '16px', fontWeight: 500 }}>Массовая оплата</div>
                            <div style={{ color: '#8c8c8c', marginTop: 4 }}>Загрузка реестра платежей</div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Card title="История платежей">
                <Table
                    dataSource={payments}
                    rowKey="id"
                    loading={loading}
                    columns={[
                        {
                            title: 'Номер',
                            dataIndex: 'id',
                            key: 'id',
                            width: 100,
                        },
                        {
                            title: 'Дата',
                            dataIndex: 'createdAt',
                            key: 'createdAt',
                            render: (date: string) => new Date(date).toLocaleString('ru-RU'),
                        },
                        {
                            title: 'Тип',
                            dataIndex: 'type',
                            key: 'type',
                            render: (type: string) => getTypeText(type),
                        },
                        {
                            title: 'Сумма',
                            dataIndex: 'amount',
                            key: 'amount',
                            render: (amount: number) => `${amount.toFixed(2)} ₽`,
                        },
                        {
                            title: 'Регион',
                            dataIndex: 'region',
                            key: 'region',
                        },
                        {
                            title: 'Статус',
                            dataIndex: 'status',
                            key: 'status',
                            render: (status: string) => getStatusTag(status),
                        },
                    ]}
                    locale={{ emptyText: 'Нет платежей' }}
                    pagination={{
                        pageSize: 10,
                        showTotal: (total) => `Всего платежей: ${total}`,
                    }}
                />
            </Card>
        </div>
    );
};

export default Payments;
