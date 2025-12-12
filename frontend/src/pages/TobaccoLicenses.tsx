import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Space, Card, message } from 'antd';
import { SearchOutlined, PhoneOutlined, EnvironmentOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { storeService } from '../services/storeService';
import type { Store } from '../types';
import './Stores.css';

const TobaccoLicenses: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        setLoading(true);
        try {
            const data = await storeService.getAllStores();
            setStores(data);
        } catch (error) {
            message.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const getLicenseStatus = (expiryDate: string | null): { status: 'expired' | 'expiring' | 'valid' | 'none'; text: string; color: string } => {
        if (!expiryDate) {
            return { status: 'none', text: 'Отсутствует', color: 'default' };
        }

        const expiry = new Date(expiryDate);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilExpiry < 0) {
            return { status: 'expired', text: `Истекла ${Math.abs(daysUntilExpiry)} дн. назад`, color: 'red' };
        } else if (daysUntilExpiry <= 30) {
            return { status: 'expiring', text: `Истекает через ${daysUntilExpiry} дн.`, color: 'orange' };
        } else {
            const expiryFormatted = expiry.toLocaleDateString('ru-RU');
            return { status: 'valid', text: `До ${expiryFormatted}`, color: 'green' };
        }
    };

    const columns: ColumnsType<Store> = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            fixed: 'left',
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            fixed: 'left',
            sorter: (a, b) => a.name.localeCompare(b.name),
            filteredValue: searchText ? [searchText] : null,
            onFilter: (value, record) => {
                const search = value.toString().toLowerCase();
                return record.name.toLowerCase().includes(search) ||
                    record.address.toLowerCase().includes(search);
            },
            render: (text: string) => (
                <Space>
                    <SafetyCertificateOutlined style={{ color: '#faad14' }} />
                    <strong>{text}</strong>
                </Space>
            ),
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            width: 300,
            render: (address) => (
                <Space>
                    <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
                    {address}
                </Space>
            ),
        },
        {
            title: 'Телефон директора',
            dataIndex: 'directorPhone',
            key: 'directorPhone',
            width: 180,
            render: (phone) => (
                <Space>
                    <PhoneOutlined style={{ color: '#52c41a' }} />
                    {phone}
                </Space>
            ),
        },
        {
            title: 'Табачная лицензия',
            dataIndex: 'tobaccoLicenseExpiry',
            key: 'tobaccoLicenseExpiry',
            width: 250,
            render: (expiry) => {
                const { text, color } = getLicenseStatus(expiry);
                return <Tag color={color}>{text}</Tag>;
            },
            sorter: (a, b) => {
                if (!a.tobaccoLicenseExpiry && !b.tobaccoLicenseExpiry) return 0;
                if (!a.tobaccoLicenseExpiry) return 1;
                if (!b.tobaccoLicenseExpiry) return -1;
                return new Date(a.tobaccoLicenseExpiry).getTime() - new Date(b.tobaccoLicenseExpiry).getTime();
            },
            defaultSortOrder: 'ascend',
        },
    ];

    return (
        <div className="stores-container">
            <Card>
                <div className="stores-header">
                    <h1>
                        <SafetyCertificateOutlined /> Табачные лицензии
                    </h1>
                    <Input
                        placeholder="Поиск по названию или адресу"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 350 }}
                        allowClear
                    />
                </div>

                <Table
                    columns={columns}
                    dataSource={stores}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Всего записей: ${total}`,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }}
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};

export default TobaccoLicenses;
