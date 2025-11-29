import React, { useState } from 'react';
import {
    Button,
    Card,
    Form,
    Select,
    Tabs,
    Tag,
    Row,
    Col,
    Space,
    Typography,
    Input,
    Table,
    DatePicker,
    Checkbox
} from 'antd';
import {
    SearchOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;
const { Option } = Select;

interface TradingObject {
    key: string;
    mvz: string;
    address: string;
    cfo: string;
    oktmo: string;
    hasRestriction: boolean;
    munArea: string;
    munDistrict: string;
    be: string;
    closeDate?: string;
}

const CreateMassPaymentTask: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const tabItems = [
        { key: '1', label: 'Задача', children: null },
        { key: '2', label: 'Документы', children: null },
        { key: '3', label: 'Статус обработки', children: null },
        { key: '4', label: 'Связанные', children: null },
    ];

    // Mock data for trading objects
    const tradingObjects: TradingObject[] = [
        {
            key: '1',
            mvz: '13CT0979',
            address: '125412, Москва г, Ангарская ул, 37/18',
            cfo: 'E1028750',
            oktmo: '45339000',
            hasRestriction: false,
            munArea: 'Москва',
            munDistrict: 'Москва',
            be: 'ООО «Агроторг»',
        },
        {
            key: '2',
            mvz: '13CTY216',
            address: '127576, Москва г, Череповецкая ул, 4А',
            cfo: 'E1028750',
            oktmo: '45339000',
            hasRestriction: true,
            munArea: 'Москва',
            munDistrict: 'Москва',
            be: 'ООО «Агроторг»',
        },
        {
            key: '3',
            mvz: '13CTX378',
            address: '127591, Москва г, 800-летия Москвы ул...',
            cfo: 'E1028750',
            oktmo: '45339000',
            hasRestriction: false,
            munArea: 'Москва',
            munDistrict: 'Москва',
            be: 'ООО «Агроторг»',
        },
    ];

    const columns: ColumnsType<TradingObject> = [
        {
            title: 'МВЗ',
            dataIndex: 'mvz',
            key: 'mvz',
            width: 100,
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
            width: 100,
        },
        {
            title: 'ОКТМО',
            dataIndex: 'oktmo',
            key: 'oktmo',
            width: 100,
        },
        {
            title: 'Есть запрет',
            dataIndex: 'hasRestriction',
            key: 'hasRestriction',
            width: 100,
            render: (hasRestriction: boolean) => (
                <Checkbox checked={hasRestriction} disabled />
            ),
        },
        {
            title: 'Мун. область',
            dataIndex: 'munArea',
            key: 'munArea',
            width: 120,
        },
        {
            title: 'Мун. район',
            dataIndex: 'munDistrict',
            key: 'munDistrict',
            width: 120,
        },
        {
            title: 'БЕ',
            dataIndex: 'be',
            key: 'be',
            width: 150,
        },
        {
            title: 'Дата закр',
            dataIndex: 'closeDate',
            key: 'closeDate',
            width: 100,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    return (
        <div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <div>
                    <Space align="center">
                        <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>Массовая оплата №00000001</Title>
                        <Tag color="orange" style={{ borderRadius: '4px' }}>Черновик</Tag>
                    </Space>
                    <div style={{ color: '#8c8c8c', fontSize: '12px', marginTop: 4, display: 'flex', alignItems: 'center' }}>
                        <SafetyCertificateOutlined style={{ marginRight: 4 }} />
                        Получение лицензии (табак)
                    </div>
                </div>
                <Space size="small">
                    <Button size="middle" danger ghost onClick={() => navigate('/payments')}>Удалить</Button>
                    <Button size="middle" type="primary" onClick={() => navigate('/payments')} style={{ background: '#1890ff', borderColor: '#1890ff', boxShadow: '0 2px 0 rgba(24, 144, 255, 0.1)' }}>Оплатить</Button>
                </Space>
            </div>

            {/* Tabs */}
            <div style={{ background: '#fff', padding: '0 16px', borderRadius: '8px', marginBottom: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <Tabs defaultActiveKey="1" items={tabItems} size="middle" tabBarStyle={{ marginBottom: 0 }} />
            </div>

            <Row gutter={16}>
                {/* Left Column - Trading Objects Selection */}
                <Col span={16}>
                    <Card
                        title={<span style={{ fontWeight: 600 }}>Добавление торгового объекта</span>}
                        size="small"
                        style={{ marginBottom: 16, borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                        headStyle={{ borderBottom: '1px solid #f0f0f0' }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            size="middle"
                            style={{ marginTop: 12 }}
                        >
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Период лицензирования"
                                        name="licensePeriod"
                                        required
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Выберите период">
                                            <Option value="5">5</Option>
                                            <Option value="10">10</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="ОКТМО"
                                        name="oktmo"
                                        required
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Выберите ОКТМО">
                                            <Option value="45380000">45380000</Option>
                                            <Option value="45339000">45339000</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label=" "
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Checkbox>ПП с отметкой банка</Checkbox>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={8}>
                                    <Form.Item
                                        label="Дата поставки"
                                        name="deliveryDate"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Муниципальная область"
                                        name="munArea"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Муниципальная область">
                                            <Option value="moscow">Москва</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Муниципальный район"
                                        name="munDistrict"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Муниципальный район">
                                            <Option value="moscow">Москва</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={18}>
                                    <Form.Item
                                        label="МВЗ"
                                        name="mvz"
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Input placeholder="МВЗ" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        label=" "
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Button type="primary" icon={<SearchOutlined />} style={{ width: '100%' }}>
                                            Найти
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>

                        {/* Trading Objects Table */}
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={tradingObjects}
                            pagination={{
                                pageSize: 10,
                                total: 20,
                                showTotal: (total, range) => `${range[0]}-${range[1]} из ${total}`,
                                showSizeChanger: true,
                            }}
                            scroll={{ x: 1200 }}
                            size="small"
                        />

                        <div style={{ marginTop: 16, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={() => navigate('/payments')}>Отмена</Button>
                                <Button type="primary" disabled={selectedRowKeys.length === 0}>
                                    Добавить ({selectedRowKeys.length})
                                </Button>
                            </Space>
                        </div>
                    </Card>
                </Col>

                {/* Right Column - General Data */}
                <Col span={8}>
                    <Card
                        title={<span style={{ fontWeight: 600 }}>Общие данные</span>}
                        size="small"
                        style={{ borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                    >
                        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ color: '#8c8c8c', fontSize: '11px', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Дата создания</div>
                            <div style={{ fontSize: '14px', color: '#262626' }}>01.11.2025</div>
                        </div>

                        <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ color: '#8c8c8c', fontSize: '11px', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Дата обновления</div>
                            <div style={{ fontSize: '14px', color: '#bfbfbf', fontStyle: 'italic' }}>Нет данных</div>
                        </div>

                        <div>
                            <div style={{ color: '#8c8c8c', fontSize: '11px', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Инициатор</div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ width: 24, height: 24, background: '#1890ff', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', marginRight: 8 }}>ИИ</div>
                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#262626' }}>Иванов Иван Иванович</div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateMassPaymentTask;
