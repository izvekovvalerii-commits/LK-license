import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Tag, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { egrnService, type EgrnExtract } from '../services/egrnService';

const { Title } = Typography;

const EgrnList: React.FC = () => {
    const navigate = useNavigate();
    const [extracts, setExtracts] = useState<EgrnExtract[]>([]);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadExtracts();
    }, []);

    const loadExtracts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await egrnService.getAll();
            console.log('Loaded extracts:', data);
            setExtracts(data);
        } catch (err: any) {
            console.error('Failed to load extracts', err);
            setError(err.message || 'Не удалось загрузить список');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Кадастровый номер',
            dataIndex: 'cadastralNumber',
            key: 'cadastralNumber',
        },
        {
            title: 'Тип объекта',
            dataIndex: 'objectType',
            key: 'objectType',
            render: (text: string) => text === 'complex' ? 'Предприятие как ИК' : text,
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'SUBMITTED') color = 'blue';
                if (status === 'COMPLETED') color = 'green';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            {error && <div style={{ marginBottom: 16, color: 'red' }}>Ошибка: {error}</div>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Выписки ЕГРН</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/documents/egrn/create')}>
                    Создать заявление
                </Button>
            </div>

            <Card>

                <Table
                    columns={columns}
                    dataSource={extracts}
                    rowKey="id"
                    loading={loading}
                    onRow={(record) => ({
                        onClick: () => navigate(`/documents/egrn/${record.id}`),
                        style: { cursor: 'pointer' }
                    })}
                />
            </Card>
        </div>
    );
};

export default EgrnList;
