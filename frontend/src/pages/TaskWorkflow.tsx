import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Tag, Space, Spin, message, Progress, Select, Tabs, Typography, Form, Input } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Task, SubtaskType, TaskStatus, User } from '../types';
import { taskService } from '../services/taskService';
import { userService } from '../services/userService';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Title } = Typography;

const subtaskLabels: Record<SubtaskType, string> = {
    GIS_ANALYSIS: 'Анализ локации в ГИС',
    DOCUMENT_UPLOAD: 'Загрузка документов',
    STATE_FEE_PAYMENT: 'Оплата государственной пошлины',
    EGRN_REQUEST: 'Запрос выписки ЕГРН',
    FIAS_ADDRESS_CHECK: 'Проверка адреса ФИАС',
};

const TaskWorkflow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [subtasks, setSubtasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    const loadUsers = async () => {
        try {
            const usersData = await userService.getAllUsers();
            setUsers(usersData);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadTaskData = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const taskData = await taskService.getTaskById(Number(id));
            setTask(taskData);

            // Load subtasks
            const response = await fetch(`/api/tasks/${id}/subtasks`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const subtasksData = await response.json();
                setSubtasks(subtasksData);
            }
        } catch (error) {
            message.error('Ошибка загрузки данных задачи');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTaskData();
        loadUsers();
    }, [id]);

    const handleSubtaskStatusChange = async (subtaskId: number, newStatus: TaskStatus) => {
        try {
            await taskService.updateTaskStatus(subtaskId, newStatus);
            message.success('Статус подзадачи обновлен');
            loadTaskData();
        } catch (error) {
            message.error('Ошибка обновления статуса');
        }
    };

    const handleSubtaskUpdate = async (subtaskId: number, values: any) => {
        try {
            await taskService.updateTask(subtaskId, {
                description: values.description,
                assigneeId: values.assigneeId
            });
            message.success('Подзадача обновлена');
            loadTaskData();
        } catch (error) {
            message.error('Ошибка обновления подзадачи');
        }
    };

    const getStatusTag = (status: TaskStatus) => {
        const statusConfig = {
            ASSIGNED: { color: 'blue', text: 'Назначена' },
            IN_PROGRESS: { color: 'orange', text: 'В работе' },
            SUSPENDED: { color: 'red', text: 'Приостановлена' },
            DONE: { color: 'green', text: 'Завершена' },
        };
        const config = statusConfig[status] || { color: 'default', text: status || 'Неизвестно' };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('ru-RU');
        } catch (e) {
            return '-';
        }
    };

    const getProgress = () => {
        if (!subtasks.length) return 0;
        const completedCount = subtasks.filter(st => st.status === 'DONE').length;
        return Math.round((completedCount / subtasks.length) * 100);
    };

    if (loading) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!task) {
        return (
            <div style={{ padding: '24px' }}>
                <p>Задача не найдена</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks/list')}>
                    Назад к списку задач
                </Button>
            </div>

            <div style={{ marginBottom: 16, background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Title level={3} style={{ margin: 0 }}>{task.title}</Title>
                    <Tag color={task.status === 'DONE' ? 'green' : task.status === 'IN_PROGRESS' ? 'blue' : 'default'}>
                        {task.status === 'DONE' ? 'Завершена' : task.status === 'IN_PROGRESS' ? 'В работе' : 'Назначена'}
                    </Tag>
                </Space>
            </div>

            {subtasks.length > 0 && (
                <Card style={{ marginBottom: 24 }}>
                    <div style={{ marginBottom: 8 }}>Прогресс выполнения: {getProgress()}%</div>
                    <Progress percent={getProgress()} status={getProgress() === 100 ? 'success' : 'active'} />
                </Card>
            )}

            <Card>
                <Tabs defaultActiveKey="main">
                    <TabPane tab="Основная информация" key="main">
                        <Descriptions column={2} bordered>
                            <Descriptions.Item label="Статус">{getStatusTag(task.status)}</Descriptions.Item>
                            <Descriptions.Item label="Тип лицензии">
                                {task.licenseType === 'ALCOHOL' ? 'Алкогольная' : 'Табачная'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Действие">
                                {task.actionType === 'NEW' ? 'Новая' : 'Продление'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Магазин">{task.storeName || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Исполнитель">{task.assigneeName || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Срок выполнения">
                                {formatDate(task.deadlineDate)}
                            </Descriptions.Item>
                            {task.plannedStartDate && (
                                <Descriptions.Item label="Плановое начало">
                                    {formatDate(task.plannedStartDate)}
                                </Descriptions.Item>
                            )}
                            {task.plannedEndDate && (
                                <Descriptions.Item label="Плановое окончание">
                                    {formatDate(task.plannedEndDate)}
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label="Описание" span={2}>
                                {task.description || '-'}
                            </Descriptions.Item>
                        </Descriptions>
                    </TabPane>

                    {subtasks.map((subtask) => (
                        <TabPane
                            tab={
                                <Space>
                                    {subtask.status === 'DONE' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                    {subtask.subtaskType ? subtaskLabels[subtask.subtaskType] : subtask.title}
                                </Space>
                            }
                            key={subtask.id}
                        >
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Title level={4} style={{ margin: 0 }}>
                                        {subtask.subtaskType ? subtaskLabels[subtask.subtaskType] : subtask.title}
                                    </Title>
                                    <Space>
                                        <span>Статус:</span>
                                        <Select
                                            value={subtask.status}
                                            onChange={(value) => handleSubtaskStatusChange(subtask.id, value)}
                                            style={{ width: 160 }}
                                        >
                                            <Select.Option value="ASSIGNED">Назначена</Select.Option>
                                            <Select.Option value="IN_PROGRESS">В работе</Select.Option>
                                            <Select.Option value="DONE">Готово</Select.Option>
                                            <Select.Option value="SUSPENDED">Отменена</Select.Option>
                                        </Select>
                                    </Space>
                                </div>

                                <Form
                                    layout="vertical"
                                    initialValues={{
                                        description: subtask.description,
                                        assigneeId: subtask.assigneeId
                                    }}
                                    onFinish={(values) => handleSubtaskUpdate(subtask.id, values)}
                                >
                                    <Form.Item name="description" label="Описание">
                                        <TextArea rows={4} placeholder="Описание подзадачи" />
                                    </Form.Item>
                                    <Form.Item name="assigneeId" label="Исполнитель">
                                        <Select placeholder="Выберите исполнителя" allowClear>
                                            {users.map((user) => (
                                                <Select.Option key={user.id} value={user.id}>
                                                    {user.fullName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button type="primary" htmlType="submit">
                                            Сохранить изменения
                                        </Button>
                                    </div>
                                </Form>

                                <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                                    <Descriptions column={2} size="small">
                                        {subtask.actualStartDate && (
                                            <Descriptions.Item label="Начато">
                                                {formatDate(subtask.actualStartDate)}
                                            </Descriptions.Item>
                                        )}
                                        {subtask.actualEndDate && (
                                            <Descriptions.Item label="Завершено">
                                                {formatDate(subtask.actualEndDate)}
                                            </Descriptions.Item>
                                        )}
                                    </Descriptions>
                                </div>
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
            </Card>
        </div>
    );
};

export default TaskWorkflow;
