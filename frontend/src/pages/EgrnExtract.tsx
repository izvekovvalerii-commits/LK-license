import React from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Space, Tabs, Tag, Typography, Progress, Upload, message } from 'antd';
import { DeleteOutlined, InboxOutlined, UserOutlined, FileTextOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { egrnService } from '../services/egrnService';

const { Option } = Select;
const { Title, Text } = Typography;
const { Dragger } = Upload;

const EgrnExtract: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            loadExtract(id);
        }
    }, [id]);

    const loadExtract = async (extractId: string) => {
        setLoading(true);
        try {
            const data = await egrnService.getById(extractId);
            form.setFieldsValue(data);
        } catch (error) {
            message.error('Ошибка при загрузке заявления');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const onFinish = async (values: any) => {
        try {
            await egrnService.create(values);
            message.success('Заявление успешно оформлено');
            navigate('/documents/egrn-list');
        } catch (error) {
            message.error('Ошибка при оформлении заявления');
            console.error(error);
        }
    };

    const tabItems = [
        { label: 'Заявление', key: 'application' },
        { label: 'Документы', key: 'documents' },
        { label: 'Подписание', key: 'signing' },
        { label: 'Статус обработки', key: 'status' },
        { label: 'Связанные', key: 'related' },
    ];

    const uploadProps = {
        name: 'file',
        multiple: true,
        customRequest: ({ file, onSuccess }: any) => {
            setTimeout(() => {
                onSuccess("ok");
                message.success(`${file.name} файл успешно загружен.`);
            }, 0);
        },
        onDrop(e: any) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <div style={{ padding: '12px 24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Form
                layout="vertical"
                form={form}
                size="small"
                onFinish={onFinish}
                onFinishFailed={(errorInfo) => {
                    console.log('Failed:', errorInfo);
                    message.error('Пожалуйста, заполните все обязательные поля');
                }}
                disabled={!!id} // Disable form if viewing existing extract
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div>
                        <Space align="center" size="small">
                            <Title level={4} style={{ margin: 0 }}>
                                {id ? `Заявка №${id}` : 'Новая заявка'}
                            </Title>
                            <Tag color="orange">Черновик</Tag>
                        </Space>
                        <div style={{ color: '#666', fontSize: '13px' }}>Тип услуги: <strong>Выписка ЕГРН</strong></div>
                    </div>
                    <Space size="small">
                        <Button icon={<DeleteOutlined />} danger size="small">Удалить</Button>
                        {!id && <Button type="primary" size="small" onClick={() => form.submit()}>Оформить заявление</Button>}
                    </Space>
                </div>

                {/* Tabs */}
                <Card bordered={false} bodyStyle={{ padding: '0 16px' }} style={{ marginBottom: 12 }}>
                    <Tabs defaultActiveKey="application" items={tabItems} size="small" style={{ marginBottom: 0 }} />
                </Card>

                <Row gutter={16}>
                    {/* Left Column - Forms */}
                    <Col span={16}>
                        {/* Applicant Details */}
                        <Card
                            title={<Space><UserOutlined /><span>Сведения о заявителе</span></Space>}
                            size="small"
                            style={{ marginBottom: 12, borderRadius: 4 }}
                            headStyle={{ minHeight: '32px', fontSize: '14px' }}
                            bodyStyle={{ padding: '12px' }}
                        >
                            <Form.Item name="applicantType" initialValue="legal" style={{ marginBottom: 8 }}>
                                <Select>
                                    <Option value="legal">Юридическое лицо</Option>
                                    <Option value="individual">Физическое лицо</Option>
                                </Select>
                            </Form.Item>
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Телефон"
                                        name="phone"
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: 'Введите телефон' }]}
                                    >
                                        <Input placeholder="+7(999) 000-00-00" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Электронная почта"
                                        name="email"
                                        style={{ marginBottom: 0 }}
                                        rules={[{ required: true, message: 'Введите email' }]}
                                    >
                                        <Input placeholder="email@example.com" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>

                        {/* Authority Docs */}
                        <Card
                            title={<Space><FileTextOutlined /><span style={{ color: '#ff4d4f' }}>*Документы, подтверждающие полномочия</span></Space>}
                            size="small"
                            style={{ marginBottom: 12, borderRadius: 4 }}
                            headStyle={{ minHeight: '32px', fontSize: '14px' }}
                            bodyStyle={{ padding: '12px' }}
                        >
                            <Dragger {...uploadProps} style={{ padding: '8px 0' }}>
                                <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                                    <InboxOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
                                </p>
                                <p className="ant-upload-text" style={{ fontSize: '13px', marginBottom: 4 }}>Нажмите или перетащите файл</p>
                            </Dragger>
                        </Card>

                        {/* Object Description */}
                        <Card
                            title={<Space><EnvironmentOutlined /><span>Описание объекта</span></Space>}
                            size="small"
                            style={{ borderRadius: 4 }}
                            headStyle={{ minHeight: '32px', fontSize: '14px' }}
                            bodyStyle={{ padding: '12px' }}
                        >
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span style={{ color: '#ff4d4f' }}>Кадастровый номер *</span>}
                                        name="cadastralNumber"
                                        style={{ marginBottom: 8 }}
                                        rules={[{ required: true, message: 'Введите кадастровый номер' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label={<span style={{ color: '#ff4d4f' }}>МВЗ *</span>}
                                        name="mvz"
                                        style={{ marginBottom: 8 }}
                                        rules={[{ required: true, message: 'Выберите МВЗ' }]}
                                    >
                                        <Select placeholder="Выберите МВЗ">
                                            <Option value="mvz1">МВЗ-1</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                label={<span style={{ color: '#ff4d4f' }}>Тип объекта *</span>}
                                name="objectType"
                                style={{ marginBottom: 0 }}
                                rules={[{ required: true, message: 'Выберите тип объекта' }]}
                            >
                                <Select placeholder="Выберите тип объекта">
                                    <Option value="complex">Предприятие как имущественный комплекс</Option>
                                </Select>
                            </Form.Item>
                        </Card>
                    </Col>

                    {/* Right Column - Info */}
                    <Col span={8}>
                        <Card title="Прогресс заполнения" size="small" style={{ height: '100%', borderRadius: 4 }} headStyle={{ minHeight: '32px', fontSize: '14px' }} bodyStyle={{ padding: '12px' }}>
                            <div style={{ textAlign: 'center', marginBottom: 16 }}>
                                <Progress type="circle" percent={0} strokeColor="#1890ff" width={60} />
                                <div style={{ marginTop: 4, color: '#8c8c8c', fontSize: '12px' }}>Заполнено</div>
                            </div>

                            <div style={{ marginTop: 16 }}>
                                <Title level={5} style={{ marginBottom: 12, fontSize: '14px' }}>Общие данные</Title>

                                <div style={{ marginBottom: 12 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 2, fontSize: '12px' }}>Рег. номер Заявления</Text>
                                    <Text type="secondary" italic style={{ fontSize: '13px' }}>нет данных</Text>
                                </div>

                                <Row gutter={12} style={{ marginBottom: 12 }}>
                                    <Col span={12}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 2, fontSize: '12px' }}>Дата заявки</Text>
                                        <Text strong style={{ fontSize: '13px' }}>18.07.2025</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Text type="secondary" style={{ display: 'block', marginBottom: 2, fontSize: '12px' }}>Дата обновления</Text>
                                        <Text strong style={{ fontSize: '13px' }}>18.07.2025</Text>
                                    </Col>
                                </Row>

                                <div style={{ marginBottom: 12 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 2, fontSize: '12px' }}>Инициатор</Text>
                                    <Space size="small">
                                        <UserOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
                                        <Text strong style={{ fontSize: '13px' }}>Иванов Иван Иванович</Text>
                                    </Space>
                                </div>

                                <div style={{ marginBottom: 12 }}>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 2, fontSize: '12px' }}>Плановая дата обработки</Text>
                                    <Text type="secondary" italic style={{ fontSize: '13px' }}>нет данных</Text>
                                </div>

                                <div>
                                    <Text type="secondary" style={{ display: 'block', marginBottom: 2, fontSize: '12px' }}>Дата завершения обработки</Text>
                                    <Text type="secondary" italic style={{ fontSize: '13px' }}>нет данных</Text>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </div>
    );
};

export default EgrnExtract;
