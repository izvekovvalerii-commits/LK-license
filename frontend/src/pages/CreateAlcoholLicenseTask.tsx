import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    Form,
    Select,
    Input,
    Space,
    Typography,
    DatePicker,
    message,
    Row,
    Col
} from 'antd';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../services/storeService';
import type { Store } from '../types';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CreateAlcoholLicenseTask: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [stores, setStores] = useState<Store[]>([]);

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            const data = await storeService.getAllStores();
            setStores(data);
        } catch (error) {
            message.error('Ошибка загрузки магазинов');
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            message.success('Задача на получение алкогольной лицензии создана');
            navigate('/tasks');
        } catch (error) {
            message.error('Ошибка создания задачи');
        }
    };

    return (
        <div style={{ padding: '16px', background: '#f0f2f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{ marginBottom: 16, background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <Space align="center">
                    <SafetyCertificateOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    <Title level={3} style={{ margin: 0 }}>Создание задачи на получение алкогольной лицензии</Title>
                </Space>
            </div>

            <Row gutter={16}>
                {/* Main Form */}
                <Col span={16}>
                    <Card
                        title={<span style={{ fontWeight: 600 }}>Данные для лицензии</span>}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            size="middle"
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Магазин"
                                        name="storeId"
                                        rules={[{ required: true, message: 'Выберите магазин' }]}
                                    >
                                        <Select placeholder="Выберите магазин">
                                            {stores.map(store => (
                                                <Option key={store.id} value={store.id}>
                                                    {store.name} - {store.address}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Срок лицензии (месяцев)"
                                        name="licensePeriod"
                                        rules={[{ required: true, message: 'Укажите срок' }]}
                                        initialValue={12}
                                    >
                                        <Select>
                                            <Option value={6}>6 месяцев</Option>
                                            <Option value={12}>12 месяцев</Option>
                                            <Option value={24}>24 месяца</Option>
                                            <Option value={36}>36 месяцев</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Дата подачи заявки"
                                        name="applicationDate"
                                        rules={[{ required: true, message: 'Выберите дату' }]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Желаемая дата получения"
                                        name="deadlineDate"
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Назначение"
                                name="description"
                            >
                                <TextArea rows={4} placeholder="Укажите дополнительные детали или комментарии" />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Space>
                                    <Button onClick={() => navigate('/tasks')}>
                                        Отмена
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        Создать задачу
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Info Card */}
                <Col span={8}>
                    <Card
                        title={<span style={{ fontWeight: 600 }}>Информация</span>}
                        style={{ borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
                    >
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: 8 }}>Тип лицензии</div>
                            <div style={{ fontSize: '14px', fontWeight: 500 }}>Алкогольная продукция</div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: 8 }}>Действие</div>
                            <div style={{ fontSize: '14px' }}>Получение новой лицензии</div>
                        </div>

                        <div>
                            <div style={{ color: '#8c8c8c', fontSize: '12px', marginBottom: 8 }}>Примерный срок</div>
                            <div style={{ fontSize: '14px' }}>30-45 рабочих дней</div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CreateAlcoholLicenseTask;
