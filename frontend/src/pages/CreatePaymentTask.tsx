
import React from 'react';
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
    Typography
} from 'antd';
import {
    PlusOutlined,
    BankOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    SafetyCertificateOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

const CreatePaymentTask: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const tabItems = [
        { key: '1', label: 'Задача', children: null },
        { key: '2', label: 'Документы', children: null },
        { key: '3', label: 'Статус обработки', children: null },
        { key: '4', label: 'Связанные', children: null },
    ];

    return (
        <div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <div>
                    <Space align="center">
                        <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>Задача №00000001</Title>
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
                {/* Left Column - Payment Details */}
                <Col span={16}>
                    <Card
                        title={<span style={{ fontWeight: 600 }}>Сведения для оплаты</span>}
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
                                <Col span={12}>
                                    <Form.Item
                                        label="Цель оплаты ГП"
                                        name="paymentPurpose"
                                        required
                                        rules={[{ required: true, message: 'Выберите цель оплаты' }]}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Выберите цель оплаты" suffixIcon={<BankOutlined style={{ color: '#bfbfbf' }} />}>
                                            <Option value="license_fee">Госпошлина за лицензию</Option>
                                            <Option value="fine">Штраф</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Торговая сеть"
                                        name="retailChain"
                                        required
                                        rules={[{ required: true, message: 'Выберите торговую сеть' }]}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Выберите торговую сеть" suffixIcon={<ShopOutlined style={{ color: '#bfbfbf' }} />}>
                                            <Option value="x5">X5 Retail Group</Option>
                                            <Option value="pyaterochka">Пятерочка</Option>
                                            <Option value="perekrestok">Перекресток</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Субъект РФ (регион)"
                                        name="region"
                                        required
                                        rules={[{ required: true, message: 'Выберите регион' }]}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Выберите регион" suffixIcon={<EnvironmentOutlined style={{ color: '#bfbfbf' }} />}>
                                            <Option value="moscow">Москва</Option>
                                            <Option value="spb">Санкт-Петербург</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Получатель платежа"
                                        name="recipient"
                                        required
                                        rules={[{ required: true, message: 'Выберите получателя' }]}
                                        style={{ marginBottom: 16 }}
                                    >
                                        <Select placeholder="Выберите получателя" suffixIcon={<BankOutlined style={{ color: '#bfbfbf' }} />}>
                                            <Option value="fns">ФНС России</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Юридическое лицо (балансовая единица)"
                                name="legalEntity"
                                required
                                rules={[{ required: true, message: 'Выберите юр. лицо' }]}
                                style={{ marginBottom: 0 }}
                            >
                                <Select placeholder="Выберите юр. лицо" suffixIcon={<SafetyCertificateOutlined style={{ color: '#bfbfbf' }} />}>
                                    <Option value="ooo_agro">ООО "Агроторг"</Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </Card>

                    <Card
                        title={<span style={{ fontWeight: 600 }}>Торговый объект</span>}
                        size="small"
                        extra={<Button size="small" type="dashed" icon={<PlusOutlined />}>Добавить</Button>}
                        bodyStyle={{ padding: '24px', background: '#fafafa' }}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                    >
                        <div style={{ textAlign: 'center', color: '#999', fontSize: '13px' }}>
                            <ShopOutlined style={{ fontSize: '24px', marginBottom: 8, color: '#d9d9d9' }} />
                            <div>Нет добавленных объектов</div>
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
                            <div style={{ fontSize: '14px', color: '#262626' }}>01.10.2025</div>
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

export default CreatePaymentTask;
