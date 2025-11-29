import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Space, Card, Select, Modal, Form, Input, DatePicker, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { storeService } from '../services/storeService';
import { userService } from '../services/userService';
import type { Task, TaskRequest, Store, User } from '../types';
import { TaskStatus, LicenseType, ActionType } from '../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const navigate = useNavigate();
    const location = useLocation();
    const [modalVisible, setModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [selectedTaskForStatus, setSelectedTaskForStatus] = useState<Task | null>(null);
    const [form] = Form.useForm();
    const [statusForm] = Form.useForm();

    useEffect(() => {
        fetchData();

        // Apply filter from Dashboard navigation
        const state = location.state as { filter?: string };
        if (state?.filter) {
            setStatusFilter(state.filter);
        }
    }, [location]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [tasksData, storesData, usersData] = await Promise.all([
                taskService.getAllTasks(),
                storeService.getAllStores(),
                userService.getAllUsers(),
            ]);
            setTasks(tasksData);
            setStores(storesData);
            setUsers(usersData);
        } catch (error) {
            message.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingTask(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        form.setFieldsValue({
            ...task,
            deadlineDate: task.deadlineDate ? dayjs(task.deadlineDate) : null,
        });
        setModalVisible(true);
    };

    const handleStatusChangeClick = (task: Task) => {
        setSelectedTaskForStatus(task);
        statusForm.setFieldsValue({
            status: task.status,
            statusReason: task.statusReason
        });
        setStatusModalVisible(true);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Удалить задачу?',
            content: 'Вы уверены, что хотите удалить эту задачу?',
            okText: 'Да',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    await taskService.deleteTask(id);
                    message.success('Задача удалена');
                    fetchData();
                } catch (error) {
                    message.error('Ошибка удаления задачи');
                }
            },
        });
    };

    const handleSubmit = async (values: any) => {
        try {
            const taskData: TaskRequest = {
                ...values,
                deadlineDate: values.deadlineDate ? values.deadlineDate.format('YYYY-MM-DD') : undefined,
            };

            if (editingTask) {
                await taskService.updateTask(editingTask.id, taskData);
                message.success('Задача обновлена');
            } else {
                await taskService.createTask(taskData);
                message.success('Задача создана');
            }

            setModalVisible(false);
            fetchData();
        } catch (error) {
            message.error('Ошибка сохранения задачи');
        }
    };

    const handleStatusSubmit = async (values: any) => {
        if (!selectedTaskForStatus) return;

        try {
            const taskData: TaskRequest = {
                title: selectedTaskForStatus.title, // Required fields
                licenseType: selectedTaskForStatus.licenseType,
                actionType: selectedTaskForStatus.actionType,
                status: values.status,
                statusReason: values.statusReason
            };

            await taskService.updateTask(selectedTaskForStatus.id, taskData);
            message.success('Статус обновлен');
            setStatusModalVisible(false);
            fetchData();
        } catch (error) {
            message.error('Ошибка обновления статуса');
        }
    };

    const statusColors: Record<TaskStatus, string> = {
        [TaskStatus.ASSIGNED]: 'blue',
        [TaskStatus.IN_PROGRESS]: 'processing',
        [TaskStatus.SUSPENDED]: 'warning',
        [TaskStatus.DONE]: 'success',
    };

    const statusLabels: Record<TaskStatus, string> = {
        [TaskStatus.ASSIGNED]: 'Назначена',
        [TaskStatus.IN_PROGRESS]: 'В работе',
        [TaskStatus.SUSPENDED]: 'Приостановлена',
        [TaskStatus.DONE]: 'Готово',
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Магазин',
            dataIndex: 'storeName',
            key: 'storeName',
        },
        {
            title: 'Ответственный',
            dataIndex: 'assigneeName',
            key: 'assigneeName',
            render: (text: string) => text || '-',
        },
        {
            title: 'Тип',
            dataIndex: 'licenseType',
            key: 'licenseType',
            render: (type: LicenseType) => type === LicenseType.ALCOHOL ? 'Алкогольная' : 'Табачная',
        },
        {
            title: 'Действие',
            dataIndex: 'actionType',
            key: 'actionType',
            render: (type: ActionType) => type === ActionType.NEW ? 'Новая' : 'Продление',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: TaskStatus, record: Task) => (
                <Space>
                    <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
                    {status === TaskStatus.SUSPENDED && record.statusReason && (
                        <Tooltip title={record.statusReason}>
                            <InfoCircleOutlined style={{ color: '#faad14' }} />
                        </Tooltip>
                    )}
                    <Button size="small" type="link" onClick={() => handleStatusChangeClick(record)}>
                        Сменить
                    </Button>
                </Space>
            ),
        },
        {
            title: 'Срок',
            dataIndex: 'deadlineDate',
            key: 'deadlineDate',
            render: (date: string) => date ? dayjs(date).format('DD.MM.YYYY') : '-',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_: any, record: Task) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                    <Button icon={<DeleteOutlined />} size="small" danger onClick={() => handleDelete(record.id)} />
                </Space>
            ),
        },
    ];

    // Filter tasks based on selected status
    const getFilteredTasks = () => {
        if (statusFilter === 'all') return tasks;

        if (statusFilter === 'assigned') {
            return tasks.filter(t => t.status === TaskStatus.ASSIGNED);
        }
        if (statusFilter === 'completed') {
            return tasks.filter(t => t.status === TaskStatus.DONE);
        }
        if (statusFilter === 'in_progress') {
            return tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
        }
        if (statusFilter === 'suspended') {
            return tasks.filter(t => t.status === TaskStatus.SUSPENDED);
        }

        return tasks;
    };

    const filteredTasks = getFilteredTasks();

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks')}>
                    Назад к выбору
                </Button>
            </div>

            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ margin: 0 }}>Список задач</h2>
                    <Space>
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            style={{ width: 200 }}
                            options={[
                                { value: 'all', label: 'Все задачи' },
                                { value: 'assigned', label: 'Назначены' },
                                { value: 'in_progress', label: 'В работе' },
                                { value: 'suspended', label: 'Приостановленные' },
                                { value: 'completed', label: 'Завершенные' },
                            ]}
                        />
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                            Создать задачу
                        </Button>
                    </Space>
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredTasks}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Всего: ${total} задач`,
                    }}
                />
            </Card>

            <Modal
                title={editingTask ? 'Редактировать задачу' : 'Создать задачу'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                width={600}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="title" label="Название" rules={[{ required: true, message: 'Введите название' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Описание">
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item name="licenseType" label="Тип лицензии" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value={LicenseType.ALCOHOL}>Алкогольная</Select.Option>
                            <Select.Option value={LicenseType.TOBACCO}>Табачная</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="actionType" label="Действие" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value={ActionType.NEW}>Получение новой</Select.Option>
                            <Select.Option value={ActionType.RENEWAL}>Продление</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="storeId" label="Магазин">
                        <Select allowClear>
                            {stores.map(store => (
                                <Select.Option key={store.id} value={store.id}>{store.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="assigneeId" label="Ответственный">
                        <Select allowClear>
                            {users.map(user => (
                                <Select.Option key={user.id} value={user.id}>{user.fullName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="deadlineDate" label="Срок выполнения">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Смена статуса"
                open={statusModalVisible}
                onCancel={() => setStatusModalVisible(false)}
                onOk={() => statusForm.submit()}
            >
                <Form form={statusForm} layout="vertical" onFinish={handleStatusSubmit}>
                    <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value={TaskStatus.ASSIGNED}>{statusLabels[TaskStatus.ASSIGNED]}</Select.Option>
                            <Select.Option value={TaskStatus.IN_PROGRESS}>{statusLabels[TaskStatus.IN_PROGRESS]}</Select.Option>
                            <Select.Option value={TaskStatus.SUSPENDED}>{statusLabels[TaskStatus.SUSPENDED]}</Select.Option>
                            <Select.Option value={TaskStatus.DONE}>{statusLabels[TaskStatus.DONE]}</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        noStyle
                        shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                    >
                        {({ getFieldValue }) =>
                            getFieldValue('status') === TaskStatus.SUSPENDED ? (
                                <Form.Item
                                    name="statusReason"
                                    label="Причина приостановки"
                                    rules={[{ required: true, message: 'Укажите причину приостановки' }]}
                                >
                                    <TextArea rows={3} />
                                </Form.Item>
                            ) : null
                        }
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TaskList;
