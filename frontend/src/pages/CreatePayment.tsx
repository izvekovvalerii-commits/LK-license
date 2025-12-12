import React, { useState, useEffect } from 'react';
import { Card, Form, Select, Button, message, Tabs, Row, Col, Typography, Tag, Avatar, Empty, Space, Modal, Table, Input, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, PlusOutlined, ShopOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { storeService } from '../services/storeService';
import { regionService } from '../services/regionService';
import { paymentService } from '../services/paymentService';
import type { Store, Region, PaymentType } from '../types';
import './CreatePayment.css';

const { Title, Text } = Typography;

const CreatePayment: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [taskNumber] = useState('00000001');
    const [status] = useState('Черновик');
    const [createdDate] = useState('01.10.2025');
    const [updatedDate] = useState('Нет данных');
    const [initiator] = useState('Иванов Иван Иванович');

    // Store selection state
    const [selectedStores, setSelectedStores] = useState<Store[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [allStores, setAllStores] = useState<Store[]>([]);
    const [filteredStores, setFilteredStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [searchText, setSearchText] = useState('');

    // Regions state
    const [regions, setRegions] = useState<Region[]>([]);
    const [regionsLoading, setRegionsLoading] = useState(false);

    useEffect(() => {
        loadRegions();
    }, []);

    const loadRegions = async () => {
        setRegionsLoading(true);
        try {
            const data = await regionService.getAllRegions();
            setRegions(data);
        } catch (error) {
            message.error('Ошибка загрузки регионов');
        } finally {
            setRegionsLoading(false);
        }
    };

    // Load stores when modal opens
    useEffect(() => {
        if (isModalVisible) {
            loadStores();
        }
    }, [isModalVisible]);

    // Filter stores based on search
    useEffect(() => {
        if (searchText) {
            const filtered = allStores.filter(store =>
                store.name.toLowerCase().includes(searchText.toLowerCase()) ||
                store.mvz.toLowerCase().includes(searchText.toLowerCase()) ||
                store.address.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredStores(filtered);
        } else {
            setFilteredStores(allStores);
        }
    }, [searchText, allStores]);

    const loadStores = async () => {
        setLoading(true);
        try {
            const stores = await storeService.getAllStores();
            setAllStores(stores);
            setFilteredStores(stores);
        } catch (error) {
            message.error('Не удалось загрузить список магазинов');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
        // Pre-select already selected stores
        setSelectedRowKeys(selectedStores.map(s => s.id));
    };

    const handleModalOk = () => {
        const selected = allStores.filter(store => selectedRowKeys.includes(store.id));
        setSelectedStores(selected);
        setIsModalVisible(false);
        setSearchText('');
        message.success(`Добавлено магазинов: ${selected.length}`);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSearchText('');
        // Reset selection to previously selected stores
        setSelectedRowKeys(selectedStores.map(s => s.id));
    };

    const handleRemoveStore = (storeId: number) => {
        setSelectedStores(prev => prev.filter(s => s.id !== storeId));
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const columns = [
        {
            title: 'МВЗ',
            dataIndex: 'mvz',
            key: 'mvz',
            width: 100,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: 200,
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            width: 250,
        },
        {
            title: 'ЦФО',
            dataIndex: 'cfo',
            key: 'cfo',
            width: 80,
        },
        {
            title: 'БЕ',
            dataIndex: 'be',
            key: 'be',
            width: 150,
        },
        {
            title: 'Лицензия (Алкоголь)',
            dataIndex: 'alcoholLicenseExpiry',
            key: 'alcoholLicenseExpiry',
            width: 150,
            render: (date: string | null) => date || 'Нет',
        },
        {
            title: 'Лицензия (Табак)',
            dataIndex: 'tobaccoLicenseExpiry',
            key: 'tobaccoLicenseExpiry',
            width: 150,
            render: (date: string | null) => date || 'Нет',
        },
    ];

    const onFinish = async (values: any) => {
        try {
            const paymentRequest = {
                amount: parseFloat(values.amount || '0'),
                type: (values.paymentPurpose === 'license' ? 'STATE_FEE' : 'STATE_FEE') as PaymentType,
                region: regions.find(r => r.id === values.region)?.name || '',
                retailNetwork: values.retailNetwork,
                legalEntity: values.legalEntity,
                paymentRecipient: values.paymentRecipient,
                oktmo: values.oktmo,
                bankMarkRequired: values.bankMarkRequired || false,
                notes: values.notes || '',
                storeIds: selectedStores.map(s => s.id),
            };

            await paymentService.createPayment(paymentRequest);
            message.success('Платеж успешно создан');
            navigate('/payments');
        } catch (error) {
            console.error('Error creating payment:', error);
            message.error('Ошибка при создании платежа');
        }
    };

    const handleDelete = () => {
        navigate('/payments');
    };

    const tabItems = [
        {
            key: 'task',
            label: 'Задача',
            children: (
                <div>
                    <Card bordered={false} style={{ marginBottom: 16, background: '#fafafa' }}>
                        <Row gutter={24}>
                            <Col span={6}>
                                <div className="info-item" style={{ marginBottom: 0 }}>
                                    <Text type="secondary" className="info-label">ДАТА СОЗДАНИЯ</Text>
                                    <Text strong>{createdDate}</Text>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div className="info-item" style={{ marginBottom: 0 }}>
                                    <Text type="secondary" className="info-label">ДАТА ОБНОВЛЕНИЯ</Text>
                                    <Text type="secondary">{updatedDate}</Text>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="info-item" style={{ marginBottom: 0 }}>
                                    <Text type="secondary" className="info-label">ИНИЦИАТОР</Text>
                                    <Space>
                                        <Avatar size="small" style={{ backgroundColor: '#1890ff' }} icon={<UserOutlined />} />
                                        <Text strong>{initiator}</Text>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Card
                        className="payment-section"
                        title="Сведения для оплаты"
                        bordered={false}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="Цель оплаты ГП"
                                    name="paymentPurpose"
                                    rules={[{ required: true, message: 'Выберите цель оплаты' }]}
                                >
                                    <Select
                                        placeholder="Выберите цель оплаты"
                                        suffixIcon={<span>🔍</span>}
                                        options={[
                                            { value: 'license', label: 'Получение лицензии (табак)' },
                                            { value: 'renewal', label: 'Продление лицензии' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Сумма платежа"
                                    name="amount"
                                    rules={[
                                        { required: true, message: 'Введите сумму платежа' },
                                        { pattern: /^\d+(\.\d{1,2})?$/, message: 'Неверный формат суммы' }
                                    ]}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Введите сумму"
                                        suffix="₽"
                                        step="0.01"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Субъект РФ (регион)"
                                    name="region"
                                    rules={[{ required: true, message: 'Выберите регион' }]}
                                >
                                    <Select
                                        placeholder="Выберите регион"
                                        suffixIcon={<span>🔍</span>}
                                        showSearch
                                        loading={regionsLoading}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={regions.map(region => ({
                                            value: region.id,
                                            label: region.name
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="Торговая сеть"
                                    name="retailNetwork"
                                    rules={[{ required: true, message: 'Выберите торговую сеть' }]}
                                >
                                    <Select
                                        placeholder="Выберите торговую сеть"
                                        suffixIcon={<span>🔍</span>}
                                        options={[
                                            { value: 'magnit', label: 'Магнит' },
                                            { value: 'pyaterochka', label: 'Пятёрочка' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Юридическое лицо (балансовая единица)"
                                    name="legalEntity"
                                    rules={[{ required: true, message: 'Выберите юр. лицо' }]}
                                >
                                    <Select
                                        placeholder="Выберите юр. лицо"
                                        suffixIcon={<span>🔍</span>}
                                        showSearch
                                        options={[
                                            { value: 'entity1', label: 'ООО "Торговый Дом"' },
                                            { value: 'entity2', label: 'ООО "Магазин"' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="Получатель платежа"
                                    name="paymentRecipient"
                                    rules={[{ required: true, message: 'Выберите получателя' }]}
                                >
                                    <Select
                                        placeholder="Выберите получателя"
                                        suffixIcon={<span>🔍</span>}
                                        options={[
                                            { value: 'rosalkogol', label: 'Росалкогольрегулирование' },
                                            { value: 'other', label: 'Другое' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item
                                    label="ОКТМО"
                                    name="oktmo"
                                    rules={[{ required: true, message: 'Введите ОКТМО' }]}
                                >
                                    <Input placeholder="Введите ОКТМО" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="bankMarkRequired"
                                    valuePropName="checked"
                                    style={{ marginTop: 30 }}
                                >
                                    <Checkbox>ПП с отметкой банка</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card
                        className="payment-section"
                        title="Торговый объект"
                        bordered={false}
                        extra={
                            <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={handleOpenModal}
                            >
                                Добавить
                            </Button>
                        }
                        style={{ marginTop: 16 }}
                    >
                        {selectedStores.length === 0 ? (
                            <Empty
                                image={<ShopOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                                description="Нет добавленных объектов"
                            />
                        ) : (
                            <Table
                                dataSource={selectedStores}
                                rowKey="id"
                                pagination={false}
                                size="small"
                                columns={[
                                    {
                                        title: 'МВЗ',
                                        dataIndex: 'mvz',
                                        key: 'mvz',
                                        width: 100,
                                    },
                                    {
                                        title: 'Название',
                                        dataIndex: 'name',
                                        key: 'name',
                                    },
                                    {
                                        title: 'Адрес',
                                        dataIndex: 'address',
                                        key: 'address',
                                    },
                                    {
                                        title: '',
                                        key: 'actions',
                                        width: 50,
                                        render: (_, record) => (
                                            <Button
                                                type="text"
                                                danger
                                                icon={<CloseOutlined />}
                                                onClick={() => handleRemoveStore(record.id)}
                                                size="small"
                                            />
                                        ),
                                    },
                                ]}
                            />
                        )}
                    </Card>
                </div>
            ),
        },
        {
            key: 'documents',
            label: 'Документы',
            children: <div style={{ padding: 24 }}>Документы будут здесь</div>,
        },
        {
            key: 'status',
            label: 'Статус обработки',
            children: <div style={{ padding: 24 }}>Статус обработки</div>,
        },
        {
            key: 'related',
            label: 'Связанные',
            children: <div style={{ padding: 24 }}>Связанные задачи</div>,
        },
    ];

    return (
        <div className="create-payment-container">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <Card className="payment-card">
                    <div className="payment-header">
                        <div className="payment-title">
                            <Title level={3} style={{ margin: 0 }}>
                                Задача №{taskNumber}
                            </Title>
                            <Tag color="orange" style={{ marginLeft: 12 }}>
                                {status}
                            </Tag>
                        </div>
                        <Space>
                            <Button danger onClick={handleDelete}>
                                Удалить
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Оплатить
                            </Button>
                        </Space>
                    </div>

                    <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                        🕐 Получение лицензии (табак)
                    </Text>

                    <Tabs
                        defaultActiveKey="task"
                        items={tabItems}
                        className="payment-tabs"
                    />
                </Card>
            </Form>

            <Modal
                title="Выбор торговых объектов"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                width={1200}
                okText="Добавить"
                cancelText="Отмена"
            >
                <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <Input
                        placeholder="Поиск по названию, МВЗ или адресу"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        allowClear
                    />
                </Space>
                <Table
                    dataSource={filteredStores}
                    rowKey="id"
                    columns={columns}
                    rowSelection={rowSelection}
                    loading={loading}
                    scroll={{ y: 400 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} магазинов`,
                    }}
                />
            </Modal>
        </div>
    );
};

export default CreatePayment;
