import React from 'react';
import { Card, Table, Row, Col } from 'antd';
import { FileTextOutlined, CopyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Payments: React.FC = () => {
    const navigate = useNavigate();

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
                    dataSource={[]}
                    columns={[
                        { title: 'Номер', dataIndex: 'id', key: 'id' },
                        { title: 'Дата', dataIndex: 'date', key: 'date' },
                        { title: 'Тип', dataIndex: 'type', key: 'type' },
                        { title: 'Сумма', dataIndex: 'amount', key: 'amount' },
                        { title: 'Статус', dataIndex: 'status', key: 'status' },
                    ]}
                    locale={{ emptyText: 'Нет платежей' }}
                />
            </Card>
        </div>
    );
};

export default Payments;
