import React, { useState, useEffect } from 'react';
import { Table, Input, Tag, Space, Card, message } from 'antd';
import { SearchOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
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
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            width: 300,
            render: (address) => (
                <span>
                    <EnvironmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    {address}
                </span>
            ),
        },
        {
            title: 'Телефон директора',
            dataIndex: 'directorPhone',
            key: 'directorPhone',
            width: 180,
            render: (phone) => (
                <span>
                    <PhoneOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                    {phone}
                </span>
            ),
        },
        {
            title: 'Табачная лицензия',
            dataIndex: 'tobaccoLicenseExpiry',
            key: 'tobaccoLicenseExpiry',
            width: 200,
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
            <Card
                title="Табачные лицензии"
                extra={
                    <Space>
                        <Input
                            placeholder="Поиск по названию или адресу"
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                            allowClear
                        />
                    </Space>
                }
            >
                <Table
                    columns={columns}
                    dataSource={stores}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 20,
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
