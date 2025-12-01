import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Select, DatePicker, Button, message, Space, Typography } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, SafetyCertificateOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Store, User, TaskRequest } from '../types';
import { LicenseType, ActionType, SubtaskType } from '../types';
import { storeService } from '../services/storeService';
import { userService } from '../services/userService';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title } = Typography;

const subtaskLabels: Record<SubtaskType, string> = {
    GIS_ANALYSIS: 'Анализ локации в ГИС',
    DOCUMENT_UPLOAD: 'Загрузка документов',
    STATE_FEE_PAYMENT: 'Оплата государственной пошлины',
    EGRN_REQUEST: 'Запрос выписки ЕГРН',
    FIAS_ADDRESS_CHECK: 'Проверка адреса ФИАС',
};

interface ProcessTaskFormProps {
    title: string;
    initialLicenseType?: LicenseType;
    fixedLicenseType?: boolean;
    icon?: React.ReactNode;
}

const ProcessTaskForm: React.FC<ProcessTaskFormProps> = ({
    title,
    initialLicenseType,
    fixedLicenseType = false,
    icon
}) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [stores, setStores] = useState<Store[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('main');

    useEffect(() => {
        loadData();
        if (initialLicenseType) {
            form.setFieldsValue({ licenseType: initialLicenseType });
        }
    }, [initialLicenseType]);

    const loadData = async () => {
        try {
            const [storesData, usersData] = await Promise.all([
                storeService.getAllStores(),
                userService.getAllUsers(),
            ]);
            setStores(storesData);
            setUsers(usersData);
        } catch (error) {
            message.error('Ошибка загрузки данных');
        }
    };

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            // Create main task
            const mainTaskData: TaskRequest = {
                title: values.title,
                description: values.description,
                licenseType: values.licenseType,
                actionType: values.actionType,
                storeId: values.storeId,
                assigneeId: values.assigneeId,
                deadlineDate: values.deadlineDate ? values.deadlineDate.format('YYYY-MM-DD') : undefined,
                plannedStartDate: values.plannedStartDate ? values.plannedStartDate.format('YYYY-MM-DD') : undefined,
                plannedEndDate: values.plannedEndDate ? values.plannedEndDate.format('YYYY-MM-DD') : undefined,
            };

            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(mainTaskData),
            });

            if (!response.ok) throw new Error('Failed to create task');
            const createdTask = await response.json();

            // Create all 5 mandatory subtasks
            const subtaskTypes: SubtaskType[] = [
                'GIS_ANALYSIS',
                'DOCUMENT_UPLOAD',
                'STATE_FEE_PAYMENT',
                'EGRN_REQUEST',
                'FIAS_ADDRESS_CHECK',
            ];

            for (const subtaskType of subtaskTypes) {
                const subtaskData: TaskRequest = {
                    title: subtaskLabels[subtaskType],
                    description: values[`${subtaskType}_description`] || '',
                    licenseType: values.licenseType,
                    actionType: values.actionType,
                    subtaskType: subtaskType,
                    assigneeId: values[`${subtaskType}_assigneeId`] || values.assigneeId,
                };

                await fetch(`/api/tasks/${createdTask.id}/subtasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(subtaskData),
                });
            }

            message.success('Задача с подзадачами создана успешно');
            navigate(`/tasks/${createdTask.id}`);
        } catch (error) {
            message.error('Ошибка создания задачи');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks')}>
                    Назад к задачам
                </Button>
            </div>

            <div style={{ marginBottom: 16, background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <Space align="center">
                    {icon}
                    <Title level={3} style={{ margin: 0 }}>{title}</Title>
                </Space>
            </div>

            <Card>
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Tabs activeKey={activeTab} onChange={setActiveTab}>
                        <TabPane tab="Основная информация" key="main">
                            <Form.Item
                                name="title"
                                label="Название задачи"
                                rules={[{ required: true, message: 'Введите название' }]}
                            >
                                <Input placeholder="Например: Получение лицензии для магазина №1" />
                            </Form.Item>

                            <Form.Item name="description" label="Описание">
                                <TextArea rows={3} placeholder="Дополнительная информация о задаче" />
                            </Form.Item>

                            <Form.Item
                                name="licenseType"
                                label="Тип лицензии"
                                rules={[{ required: true, message: 'Выберите тип' }]}
                            >
                                <Select
                                    placeholder="Выберите тип лицензии"
                                    disabled={fixedLicenseType}
                                >
                                    <Select.Option value={LicenseType.ALCOHOL}>Алкогольная</Select.Option>
                                    <Select.Option value={LicenseType.TOBACCO}>Табачная</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="actionType"
                                label="Действие"
                                rules={[{ required: true, message: 'Выберите действие' }]}
                            >
                                <Select placeholder="Выберите действие">
                                    <Select.Option value={ActionType.NEW}>Получение новой</Select.Option>
                                    <Select.Option value={ActionType.RENEWAL}>Продление</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="storeId" label="Магазин">
                                <Select placeholder="Выберите магазин" allowClear>
                                    {stores.map((store) => (
                                        <Select.Option key={store.id} value={store.id}>
                                            {store.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="assigneeId" label="Ответственный">
                                <Select placeholder="Выберите ответственного" allowClear>
                                    {users.map((user) => (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item name="plannedStartDate" label="Плановая дата начала">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item name="plannedEndDate" label="Плановая дата окончания">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item name="deadlineDate" label="Крайний срок">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="1. Анализ ГИС" key="GIS_ANALYSIS">
                            <h3>Анализ локации в ГИС</h3>
                            <Form.Item name="GIS_ANALYSIS_description" label="Описание работ">
                                <TextArea
                                    rows={4}
                                    placeholder="Опишите, что нужно сделать для анализа локации в ГИС"
                                />
                            </Form.Item>
                            <Form.Item name="GIS_ANALYSIS_assigneeId" label="Ответственный за подзадачу">
                                <Select placeholder="Выберите ответственного" allowClear>
                                    {users.map((user) => (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="2. Загрузка документов" key="DOCUMENT_UPLOAD">
                            <h3>Загрузка документов</h3>
                            <Form.Item name="DOCUMENT_UPLOAD_description" label="Описание работ">
                                <TextArea rows={4} placeholder="Опишите, какие документы нужно загрузить" />
                            </Form.Item>
                            <Form.Item name="DOCUMENT_UPLOAD_assigneeId" label="Ответственный за подзадачу">
                                <Select placeholder="Выберите ответственного" allowClear>
                                    {users.map((user) => (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="3. Оплата пошлины" key="STATE_FEE_PAYMENT">
                            <h3>Оплата государственной пошлины</h3>
                            <Form.Item name="STATE_FEE_PAYMENT_description" label="Описание работ">
                                <TextArea rows={4} placeholder="Опишите процесс оплаты государственной пошлины" />
                            </Form.Item>
                            <Form.Item name="STATE_FEE_PAYMENT_assigneeId" label="Ответственный за подзадачу">
                                <Select placeholder="Выберите ответственного" allowClear>
                                    {users.map((user) => (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="4. Запрос ЕГРН" key="EGRN_REQUEST">
                            <h3>Запрос выписки ЕГРН</h3>
                            <Form.Item name="EGRN_REQUEST_description" label="Описание работ">
                                <TextArea rows={4} placeholder="Опишите процесс запроса выписки ЕГРН" />
                            </Form.Item>
                            <Form.Item name="EGRN_REQUEST_assigneeId" label="Ответственный за подзадачу">
                                <Select placeholder="Выберите ответственного" allowClear>
                                    {users.map((user) => (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </TabPane>

                        <TabPane tab="5. Проверка ФИАС" key="FIAS_ADDRESS_CHECK">
                            <h3>Проверка адреса ФИАС</h3>
                            <Form.Item name="FIAS_ADDRESS_CHECK_description" label="Описание работ">
                                <TextArea rows={4} placeholder="Опишите процесс проверки адреса в ФИАС" />
                            </Form.Item>
                            <Form.Item name="FIAS_ADDRESS_CHECK_assigneeId" label="Ответственный за подзадачу">
                                <Select placeholder="Выберите ответственного" allowClear>
                                    {users.map((user) => (
                                        <Select.Option key={user.id} value={user.id}>
                                            {user.fullName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </TabPane>
                    </Tabs>

                    <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <Button onClick={() => navigate('/tasks')}>Отмена</Button>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                            Создать задачу с подзадачами
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ProcessTaskForm;
