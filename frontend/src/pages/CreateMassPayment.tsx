import React, { useState, useEffect } from 'react';
import { Card, Table, Button, message, Steps, Input, Form, Select, Row, Col, Typography, Tag, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { SearchOutlined, ArrowLeftOutlined, CheckCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { storeService } from '../services/storeService';
import { regionService } from '../services/regionService';
import { paymentService } from '../services/paymentService';
import type { Store, Region, PaymentType } from '../types';

const { Title, Text } = Typography;

const CreateMassPayment: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);

    // Store selection state
    const [allStores, setAllStores] = useState<Store[]>([]);
    const [filteredStores, setFilteredStores] = useState<Store[]>([]);
    const [selectedStores, setSelectedStores] = useState<Store[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Regions state
    const [regions, setRegions] = useState<Region[]>([]);
    const [regionsLoading, setRegionsLoading] = useState(false);

    useEffect(() => {
        loadStores();
        loadRegions();
    }, []);

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

    const handleNext = () => {
        const selected = allStores.filter(store => selectedRowKeys.includes(store.id));
        setSelectedStores(selected);
        setCurrentStep(1);
    };

    const handleBack = () => {
        setCurrentStep(0);
    };

    const handleRemoveStore = (storeId: number) => {
        setSelectedStores(prev => prev.filter(s => s.id !== storeId));
        setSelectedRowKeys(prev => prev.filter(key => key !== storeId));
    };

    const onFinish = async (values: any) => {
        try {
            const paymentBaseData = {
                amount: parseFloat(values.amount || '0'),
                type: (values.paymentPurpose === 'license' ? 'STATE_FEE' : 'STATE_FEE') as PaymentType,
                region: regions.find(r => r.id === values.region)?.name || '',
                retailNetwork: values.retailNetwork,
                legalEntity: values.legalEntity,
                paymentRecipient: values.paymentRecipient,
                oktmo: values.oktmo,
                bankMarkRequired: values.bankMarkRequired || false,
                notes: values.notes || '',
            };

            // Create separate payment for each store
            for (const store of selectedStores) {
                await paymentService.createPayment({
                    ...paymentBaseData,
                    storeIds: [store.id],
                });
            }

            message.success(`Успешно создано ${selectedStores.length} платежей`);
            navigate('/payments');
        } catch (error) {
            console.error('Error creating payments:', error);
            message.error('Ошибка при создании платежей');
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const storeColumns = [
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

    const selectedStoreColumns = [
        {
            title: 'МВЗ',
            dataIndex: 'mvz',
            key: 'mvz',
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
            key: 'action',
            width: 50,
            render: (_: any, record: Store) => (
                <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => handleRemoveStore(record.id)}
                    size="small"
                />
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: 24 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/payments')}
                        style={{ marginRight: 16 }}
                    >
                        Назад
                    </Button>
                    <Title level={2} style={{ display: 'inline', margin: 0 }}>
                        Массовая оплата
                    </Title>
                </div>

                <Steps
                    current={currentStep}
                    style={{ marginBottom: 32 }}
                    items={[
                        {
                            title: 'Выбор магазинов',
                            icon: currentStep > 0 ? <CheckCircleOutlined /> : undefined,
                        },
                        {
                            title: 'Оформление платежа',
                        },
                    ]}
                />

                {currentStep === 0 && (
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <Input
                                placeholder="Поиск по названию, МВЗ или адресу..."
                                prefix={<SearchOutlined />}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ maxWidth: 400 }}
                                allowClear
                            />
                        </div>

                        <Table
                            dataSource={filteredStores}
                            columns={storeColumns}
                            rowKey="id"
                            loading={loading}
                            rowSelection={rowSelection}
                            pagination={{
                                pageSize: 10,
                                showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} магазинов`,
                            }}
                            scroll={{ x: 1200 }}
                        />

                        <div style={{ marginTop: 16, textAlign: 'right' }}>
                            <Text style={{ marginRight: 16 }}>
                                Выбрано: <strong>{selectedRowKeys.length}</strong> магазинов
                            </Text>
                            <Button
                                type="primary"
                                onClick={handleNext}
                                disabled={selectedRowKeys.length === 0}
                                size="large"
                            >
                                Далее
                            </Button>
                        </div>
                    </div>
                )}

                {currentStep === 1 && (
                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={24}>
                            <Col span={16}>
                                <Card title="Сведения для оплаты" bordered={false} style={{ marginBottom: 16 }}>
                                    <Form.Item
                                        label="Цель оплаты ГП"
                                        name="paymentPurpose"
                                        rules={[{ required: true, message: 'Выберите цель оплаты' }]}
                                    >
                                        <Select
                                            placeholder="Выберите цель оплаты"
                                            options={[
                                                { value: 'license', label: 'Получение лицензии (табак)' },
                                                { value: 'renewal', label: 'Продление лицензии' },
                                            ]}
                                        />
                                    </Form.Item>

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

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Субъект РФ (регион)"
                                                name="region"
                                                rules={[{ required: true, message: 'Выберите регион' }]}
                                            >
                                                <Select
                                                    placeholder="Выберите регион"
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
                                        <Col span={12}>
                                            <Form.Item
                                                label="Торговая сеть"
                                                name="retailNetwork"
                                                rules={[{ required: true, message: 'Выберите торговую сеть' }]}
                                            >
                                                <Select
                                                    placeholder="Выберите торговую сеть"
                                                    options={[
                                                        { value: 'magnit', label: 'Магнит' },
                                                        { value: 'pyaterochka', label: 'Пятёрочка' },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Юридическое лицо (балансовая единица)"
                                                name="legalEntity"
                                                rules={[{ required: true, message: 'Выберите юр. лицо' }]}
                                            >
                                                <Select
                                                    placeholder="Выберите юр. лицо"
                                                    showSearch
                                                    options={[
                                                        { value: 'entity1', label: 'ООО "Торговый Дом"' },
                                                        { value: 'entity2', label: 'ООО "Магазин"' },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                label="Получатель платежа"
                                                name="paymentRecipient"
                                                rules={[{ required: true, message: 'Выберите получателя' }]}
                                            >
                                                <Select
                                                    placeholder="Выберите получателя"
                                                    options={[
                                                        { value: 'rosalkogol', label: 'Росалкогольрегулирование' },
                                                        { value: 'other', label: 'Другое' },
                                                    ]}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                label="ОКТМО"
                                                name="oktmo"
                                                rules={[{ required: true, message: 'Введите ОКТМО' }]}
                                            >
                                                <Input placeholder="Введите ОКТМО" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name="bankMarkRequired"
                                                valuePropName="checked"
                                                style={{ marginTop: 30 }}
                                            >
                                                <Checkbox>ПП с отметкой банка</Checkbox>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item label="Примечания" name="notes">
                                        <Input.TextArea rows={3} placeholder="Дополнительная информация (необязательно)" />
                                    </Form.Item>
                                </Card>

                                <Card title="Выбранные магазины" bordered={false}>
                                    <Table
                                        dataSource={selectedStores}
                                        columns={selectedStoreColumns}
                                        rowKey="id"
                                        pagination={false}
                                        scroll={{ y: 300 }}
                                    />
                                    <div style={{ marginTop: 16 }}>
                                        <Tag color="blue">Всего магазинов: {selectedStores.length}</Tag>
                                    </div>
                                </Card>

                                <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                                    <Button onClick={handleBack}>
                                        Назад
                                    </Button>
                                    <Button type="primary" htmlType="submit" size="large">
                                        Создать платеж
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default CreateMassPayment;
