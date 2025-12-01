import React, { useState, useEffect } from 'react';
import {
    Card,
    Tabs,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    message,
    Space,
    Typography,
    Spin,
    Tag,
    Progress,
    Divider,
    Row,
    Col,
    Alert,
    Badge,
    Statistic,
    Upload,
    List,
} from 'antd';
import type { UploadFile } from 'antd';
import {
    ArrowLeftOutlined,
    SaveOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    InfoCircleOutlined,
    UploadOutlined,
    PaperClipOutlined,
    DeleteOutlined,
    DownloadOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { Store, User, TaskRequest, Task } from '../types';
import { SubtaskType, TaskStatus } from '../types';
import { storeService } from '../services/storeService';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import api from '../services/api';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const subtaskLabels: Record<SubtaskType, string> = {
    GIS_ANALYSIS: 'Анализ локации в ГИС',
    DOCUMENT_UPLOAD: 'Загрузка документов',
    STATE_FEE_PAYMENT: 'Оплата государственной пошлины',
    EGRN_REQUEST: 'Запрос выписки ЕГРН',
    FIAS_ADDRESS_CHECK: 'Проверка адреса ФИАС',
};

const subtaskOrder: SubtaskType[] = [
    'GIS_ANALYSIS',
    'DOCUMENT_UPLOAD',
    'STATE_FEE_PAYMENT',
    'EGRN_REQUEST',
    'FIAS_ADDRESS_CHECK',
];

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
    [TaskStatus.ASSIGNED]: {
        label: 'Назначена',
        color: 'blue',
        icon: <ClockCircleOutlined />,
    },
    [TaskStatus.IN_PROGRESS]: {
        label: 'В работе',
        color: 'processing',
        icon: <PlayCircleOutlined />,
    },
    [TaskStatus.SUSPENDED]: {
        label: 'Приостановлена',
        color: 'warning',
        icon: <PauseCircleOutlined />,
    },
    [TaskStatus.DONE]: {
        label: 'Завершена',
        color: 'success',
        icon: <CheckCircleOutlined />,
    },
};

const EditProcessTask: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [stores, setStores] = useState<Store[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('main');
    const [task, setTask] = useState<Task | null>(null);
    const [subtasks, setSubtasks] = useState<Task[]>([]);
    const [currentStatus, setCurrentStatus] = useState<TaskStatus>(TaskStatus.ASSIGNED);
    const [fileListsBySubtask, setFileListsBySubtask] = useState<Record<SubtaskType, UploadFile[]>>({
        GIS_ANALYSIS: [],
        DOCUMENT_UPLOAD: [],
        STATE_FEE_PAYMENT: [],
        EGRN_REQUEST: [],
        FIAS_ADDRESS_CHECK: [],
    });
    const [uploadingSubtask, setUploadingSubtask] = useState<SubtaskType | null>(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [storesData, usersData, taskData] = await Promise.all([
                storeService.getAllStores(),
                userService.getAllUsers(),
                taskService.getTaskById(Number(id))
            ]);

            setStores(storesData);
            setUsers(usersData);
            setTask(taskData);
            setCurrentStatus(taskData.status);

            // Load subtasks using axios API
            try {
                const response = await api.get<Task[]>(`/tasks/${id}/subtasks`);
                const subtasksData = response.data;
                setSubtasks(subtasksData);

                // Load documents for each subtask
                for (const subtask of subtasksData) {
                    if (subtask.subtaskType) {
                        await loadSubtaskDocuments(subtask.id, subtask.subtaskType);
                    }
                }
            } catch (error) {
                console.error('Error loading subtasks:', error);
                // Continue even if subtasks fail to load
            }

            // Populate main form
            form.setFieldsValue({
                title: taskData.title,
                description: taskData.description,
                licenseType: taskData.licenseType,
                actionType: taskData.actionType,
                storeId: taskData.storeId,
                assigneeId: taskData.assigneeId,
                deadlineDate: taskData.deadlineDate ? dayjs(taskData.deadlineDate) : undefined,
                status: taskData.status,
            });
        } catch (error) {
            message.error('Ошибка загрузки данных задачи');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const populateSubtaskForms = () => {
        // Populate subtask forms after subtasks are loaded
        subtasks.forEach((subtask: Task) => {
            if (subtask.subtaskType) {
                form.setFieldsValue({
                    [`${subtask.subtaskType}_description`]: subtask.description,
                    [`${subtask.subtaskType}_assigneeId`]: subtask.assigneeId,
                    [`${subtask.subtaskType}_plannedStartDate`]: subtask.plannedStartDate ? dayjs(subtask.plannedStartDate) : undefined,
                    [`${subtask.subtaskType}_plannedEndDate`]: subtask.plannedEndDate ? dayjs(subtask.plannedEndDate) : undefined,
                    [`${subtask.subtaskType}_status`]: subtask.status,
                });
            }
        });
    };

    // Populate forms when subtasks change
    useEffect(() => {
        if (subtasks.length > 0) {
            populateSubtaskForms();
        }
    }, [subtasks]);

    const handleStatusChange = async (newStatus: TaskStatus) => {
        try {
            await taskService.updateTaskStatus(Number(id), newStatus);
            setCurrentStatus(newStatus);
            form.setFieldValue('status', newStatus);
            message.success('Статус задачи обновлен');
        } catch (error) {
            message.error('Ошибка при изменении статуса');
            console.error(error);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            setSubmitting(true);

            // Update main task
            const mainTaskData: TaskRequest = {
                title: values.title,
                description: values.description,
                licenseType: values.licenseType,
                actionType: values.actionType,
                storeId: values.storeId,
                assigneeId: values.assigneeId,
                deadlineDate: values.deadlineDate ? values.deadlineDate.toISOString() : undefined,
                status: values.status,
            };

            await taskService.updateTask(Number(id), mainTaskData);

            // Update subtasks
            for (const subtask of subtasks) {
                if (subtask.subtaskType) {
                    const subtaskData: TaskRequest = {
                        title: subtaskLabels[subtask.subtaskType],
                        description: values[`${subtask.subtaskType}_description`],
                        licenseType: values.licenseType,
                        actionType: values.actionType,
                        assigneeId: values[`${subtask.subtaskType}_assigneeId`],
                        plannedStartDate: values[`${subtask.subtaskType}_plannedStartDate`]
                            ? values[`${subtask.subtaskType}_plannedStartDate`].toISOString()
                            : undefined,
                        plannedEndDate: values[`${subtask.subtaskType}_plannedEndDate`]
                            ? values[`${subtask.subtaskType}_plannedEndDate`].toISOString()
                            : undefined,
                        subtaskType: subtask.subtaskType,
                        status: values[`${subtask.subtaskType}_status`],
                    };

                    await taskService.updateTask(subtask.id, subtaskData);
                }
            }

            message.success('Задача успешно обновлена');
            navigate('/tasks/list');
        } catch (error) {
            message.error('Ошибка при обновлении задачи');
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubtaskStatusChange = async (subtaskId: number, newStatus: TaskStatus, subtaskType: SubtaskType) => {
        try {
            await taskService.updateTaskStatus(subtaskId, newStatus);

            // Update local state
            setSubtasks(prev => prev.map(st =>
                st.id === subtaskId ? { ...st, status: newStatus } : st
            ));

            form.setFieldValue(`${subtaskType}_status`, newStatus);
            message.success('Статус подзадачи обновлен');
        } catch (error) {
            message.error('Ошибка при изменении статуса подзадачи');
            console.error(error);
        }
    };

    const handleFileUpload = async (subtaskType: SubtaskType, file: File) => {
        const subtask = subtasks.find(st => st.subtaskType === subtaskType);
        if (!subtask) {
            message.error('Подзадача не найдена');
            return false;
        }

        setUploadingSubtask(subtaskType);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(`/tasks/${subtask.id}/documents`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const uploadedFile = response.data;

            setFileListsBySubtask(prev => ({
                ...prev,
                [subtaskType]: [
                    ...prev[subtaskType],
                    {
                        uid: uploadedFile.id.toString(),
                        name: uploadedFile.fileName,
                        status: 'done',
                        url: `/api/documents/${uploadedFile.id}/download`,
                    },
                ],
            }));

            message.success('Файл успешно загружен');
            return true;
        } catch (error) {
            message.error('Ошибка при загрузке файла');
            console.error(error);
            return false;
        } finally {
            setUploadingSubtask(null);
        }
    };

    const handleFileRemove = async (subtaskType: SubtaskType, file: UploadFile) => {
        try {
            await api.delete(`/documents/${file.uid}`);

            setFileListsBySubtask(prev => ({
                ...prev,
                [subtaskType]: prev[subtaskType].filter(f => f.uid !== file.uid),
            }));

            message.success('Файл удален');
        } catch (error) {
            message.error('Ошибка при удалении файла');
            console.error(error);
        }
    };

    const loadSubtaskDocuments = async (subtaskId: number, subtaskType: SubtaskType) => {
        try {
            const response = await api.get<any[]>(`/tasks/${subtaskId}/documents`);
            const documents = response.data;
            setFileListsBySubtask(prev => ({
                ...prev,
                [subtaskType]: documents.map((doc: any) => ({
                    uid: doc.id.toString(),
                    name: doc.fileName,
                    status: 'done',
                    url: `/api/documents/${doc.id}/download`,
                })),
            }));
        } catch (error) {
            console.error('Error loading documents:', error);
        }
    };


    const calculateProgress = () => {
        if (subtasks.length === 0) return 0;
        const completedSubtasks = subtasks.filter(st => st.status === TaskStatus.DONE).length;
        return Math.round((completedSubtasks / subtasks.length) * 100);
    };

    const getDaysUntilDeadline = () => {
        if (!task?.deadlineDate) return null;
        const days = dayjs(task.deadlineDate).diff(dayjs(), 'days');
        return days;
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
                <Alert
                    message="Задача не найдена"
                    description="Запрошенная задача не существует или была удалена"
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    const daysLeft = getDaysUntilDeadline();
    const progress = calculateProgress();

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header with Status */}
            <Card
                style={{
                    marginBottom: 24,
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
            >
                <Row gutter={24} align="middle">
                    <Col flex="auto">
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Space>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    onClick={() => navigate('/tasks/list')}
                                >
                                    Назад
                                </Button>
                                <Title level={3} style={{ margin: 0 }}>
                                    {task.title}
                                </Title>
                            </Space>
                            <Space size="middle">
                                <Badge
                                    status={statusConfig[currentStatus].color as any}
                                    text={
                                        <span style={{ fontSize: 14 }}>
                                            {statusConfig[currentStatus].icon}{' '}
                                            {statusConfig[currentStatus].label}
                                        </span>
                                    }
                                />
                                {task.storeName && (
                                    <Tag color="blue">{task.storeName}</Tag>
                                )}
                                {task.assigneeName && (
                                    <Tag icon={<InfoCircleOutlined />}>
                                        {task.assigneeName}
                                    </Tag>
                                )}
                            </Space>
                        </Space>
                    </Col>
                    <Col>
                        <Space direction="vertical" size="small" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 12, color: '#8c8c8c' }}>
                                Прогресс выполнения
                            </div>
                            <Progress
                                type="circle"
                                percent={progress}
                                width={80}
                                strokeColor={{
                                    '0%': '#108ee9',
                                    '100%': '#52c41a',
                                }}
                            />
                        </Space>
                    </Col>
                    {daysLeft !== null && (
                        <Col>
                            <Statistic
                                title="До дедлайна"
                                value={daysLeft}
                                suffix="дн."
                                valueStyle={{
                                    color: daysLeft < 3 ? '#ff4d4f' : daysLeft < 7 ? '#faad14' : '#52c41a',
                                }}
                            />
                        </Col>
                    )}
                </Row>

                <Divider />

                {/* Status Management */}
                <div>
                    <Space wrap size="middle">
                        <Button
                            type={currentStatus === TaskStatus.ASSIGNED ? 'primary' : 'default'}
                            icon={<ClockCircleOutlined />}
                            onClick={() => handleStatusChange(TaskStatus.ASSIGNED)}
                            disabled={currentStatus === TaskStatus.ASSIGNED}
                            style={{
                                background: currentStatus === TaskStatus.ASSIGNED ? '#1890ff' : '#e6f7ff',
                                borderColor: '#91d5ff',
                                color: currentStatus === TaskStatus.ASSIGNED ? '#fff' : '#1890ff',
                                fontWeight: 500,
                                height: 40,
                                minWidth: 140,
                            }}
                        >
                            Назначена
                        </Button>
                        <Button
                            type={currentStatus === TaskStatus.IN_PROGRESS ? 'primary' : 'default'}
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
                            disabled={currentStatus === TaskStatus.IN_PROGRESS}
                            style={{
                                background: currentStatus === TaskStatus.IN_PROGRESS ? '#52c41a' : '#f6ffed',
                                borderColor: '#b7eb8f',
                                color: currentStatus === TaskStatus.IN_PROGRESS ? '#fff' : '#52c41a',
                                fontWeight: 500,
                                height: 40,
                                minWidth: 140,
                            }}
                        >
                            В работе
                        </Button>
                        <Button
                            type={currentStatus === TaskStatus.SUSPENDED ? 'primary' : 'default'}
                            icon={<PauseCircleOutlined />}
                            onClick={() => handleStatusChange(TaskStatus.SUSPENDED)}
                            disabled={currentStatus === TaskStatus.SUSPENDED}
                            style={{
                                background: currentStatus === TaskStatus.SUSPENDED ? '#faad14' : '#fffbe6',
                                borderColor: '#ffe58f',
                                color: currentStatus === TaskStatus.SUSPENDED ? '#fff' : '#faad14',
                                fontWeight: 500,
                                height: 40,
                                minWidth: 140,
                            }}
                        >
                            Приостановлена
                        </Button>
                        <Button
                            type={currentStatus === TaskStatus.DONE ? 'primary' : 'default'}
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleStatusChange(TaskStatus.DONE)}
                            disabled={currentStatus === TaskStatus.DONE}
                            style={{
                                background: currentStatus === TaskStatus.DONE ? '#13c2c2' : '#e6fffb',
                                borderColor: '#87e8de',
                                color: currentStatus === TaskStatus.DONE ? '#fff' : '#13c2c2',
                                fontWeight: 500,
                                height: 40,
                                minWidth: 140,
                            }}
                        >
                            Завершена
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Main Form */}
            <Card
                style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                        {/* Main Information Tab */}
                        <TabPane tab="Основная информация" key="main">
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="title"
                                        label="Название задачи"
                                        rules={[{ required: true, message: 'Введите название задачи' }]}
                                    >
                                        <Input placeholder="Например: Получение лицензии для магазина №1" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        name="deadlineDate"
                                        label="Срок выполнения"
                                    >
                                        <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item name="description" label="Описание">
                                <TextArea rows={4} placeholder="Дополнительная информация о задаче" />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="licenseType"
                                        label="Тип лицензии"
                                        rules={[{ required: true, message: 'Выберите тип лицензии' }]}
                                    >
                                        <Select placeholder="Выберите тип лицензии">
                                            <Select.Option value="ALCOHOL">Алкогольная</Select.Option>
                                            <Select.Option value="TOBACCO">Табачная</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        name="actionType"
                                        label="Действие"
                                        rules={[{ required: true, message: 'Выберите действие' }]}
                                    >
                                        <Select placeholder="Выберите действие">
                                            <Select.Option value="NEW">Новая</Select.Option>
                                            <Select.Option value="RENEWAL">Продление</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item name="status" label="Статус">
                                        <Select disabled>
                                            {Object.entries(statusConfig).map(([status, config]) => (
                                                <Select.Option key={status} value={status}>
                                                    {config.label}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="storeId" label="Магазин">
                                        <Select
                                            placeholder="Выберите магазин"
                                            showSearch
                                            filterOption={(input, option) => {
                                                const label = option?.label as string || '';
                                                return label.toLowerCase().includes(input.toLowerCase());
                                            }}
                                            options={stores.map((store) => ({
                                                value: store.id,
                                                label: `${store.name} (${store.mvz})`
                                            }))}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item name="assigneeId" label="Ответственный">
                                        <Select placeholder="Выберите ответственного">
                                            {users.map((user) => (
                                                <Select.Option key={user.id} value={user.id}>
                                                    {user.fullName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </TabPane>

                        {/* Subtask Tabs */}
                        {subtaskOrder.map((subtaskType) => {
                            const subtask = subtasks.find(st => st.subtaskType === subtaskType);
                            const subtaskStatus = subtask?.status || TaskStatus.ASSIGNED;

                            return (
                                <TabPane
                                    tab={
                                        <Space>
                                            {subtaskLabels[subtaskType]}
                                            {subtaskStatus === TaskStatus.DONE && (
                                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                            )}
                                        </Space>
                                    }
                                    key={subtaskType}
                                >
                                    {/* Subtask Status Management */}
                                    <div style={{ marginBottom: 20 }}>
                                        <Space wrap size="middle">
                                            <Button
                                                type={subtaskStatus === TaskStatus.ASSIGNED ? 'primary' : 'default'}
                                                icon={<ClockCircleOutlined />}
                                                onClick={() => subtask && handleSubtaskStatusChange(subtask.id, TaskStatus.ASSIGNED, subtaskType)}
                                                disabled={subtaskStatus === TaskStatus.ASSIGNED || !subtask}
                                                style={{
                                                    background: subtaskStatus === TaskStatus.ASSIGNED ? '#1890ff' : '#e6f7ff',
                                                    borderColor: '#91d5ff',
                                                    color: subtaskStatus === TaskStatus.ASSIGNED ? '#fff' : '#1890ff',
                                                    fontWeight: 500,
                                                    height: 40,
                                                    minWidth: 140,
                                                }}
                                            >
                                                Назначена
                                            </Button>
                                            <Button
                                                type={subtaskStatus === TaskStatus.IN_PROGRESS ? 'primary' : 'default'}
                                                icon={<PlayCircleOutlined />}
                                                onClick={() => subtask && handleSubtaskStatusChange(subtask.id, TaskStatus.IN_PROGRESS, subtaskType)}
                                                disabled={subtaskStatus === TaskStatus.IN_PROGRESS || !subtask}
                                                style={{
                                                    background: subtaskStatus === TaskStatus.IN_PROGRESS ? '#52c41a' : '#f6ffed',
                                                    borderColor: '#b7eb8f',
                                                    color: subtaskStatus === TaskStatus.IN_PROGRESS ? '#fff' : '#52c41a',
                                                    fontWeight: 500,
                                                    height: 40,
                                                    minWidth: 140,
                                                }}
                                            >
                                                В работе
                                            </Button>
                                            <Button
                                                type={subtaskStatus === TaskStatus.SUSPENDED ? 'primary' : 'default'}
                                                icon={<PauseCircleOutlined />}
                                                onClick={() => subtask && handleSubtaskStatusChange(subtask.id, TaskStatus.SUSPENDED, subtaskType)}
                                                disabled={subtaskStatus === TaskStatus.SUSPENDED || !subtask}
                                                style={{
                                                    background: subtaskStatus === TaskStatus.SUSPENDED ? '#faad14' : '#fffbe6',
                                                    borderColor: '#ffe58f',
                                                    color: subtaskStatus === TaskStatus.SUSPENDED ? '#fff' : '#faad14',
                                                    fontWeight: 500,
                                                    height: 40,
                                                    minWidth: 140,
                                                }}
                                            >
                                                Приостановлена
                                            </Button>
                                            <Button
                                                type={subtaskStatus === TaskStatus.DONE ? 'primary' : 'default'}
                                                icon={<CheckCircleOutlined />}
                                                onClick={() => subtask && handleSubtaskStatusChange(subtask.id, TaskStatus.DONE, subtaskType)}
                                                disabled={subtaskStatus === TaskStatus.DONE || !subtask}
                                                style={{
                                                    background: subtaskStatus === TaskStatus.DONE ? '#13c2c2' : '#e6fffb',
                                                    borderColor: '#87e8de',
                                                    color: subtaskStatus === TaskStatus.DONE ? '#fff' : '#13c2c2',
                                                    fontWeight: 500,
                                                    height: 40,
                                                    minWidth: 140,
                                                }}
                                            >
                                                Завершена
                                            </Button>
                                        </Space>
                                    </div>

                                    <Divider />

                                    <Form.Item
                                        name={`${subtaskType}_description`}
                                        label="Описание"
                                    >
                                        <TextArea rows={3} placeholder="Описание подзадачи" />
                                    </Form.Item>

                                    <Form.Item
                                        name={`${subtaskType}_assigneeId`}
                                        label="Исполнитель"
                                    >
                                        <Select placeholder="Выберите исполнителя">
                                            {users.map((user) => (
                                                <Select.Option key={user.id} value={user.id}>
                                                    {user.fullName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name={`${subtaskType}_plannedStartDate`}
                                                label="Плановая дата начала"
                                            >
                                                <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <Form.Item
                                                name={`${subtaskType}_plannedEndDate`}
                                                label="Плановая дата окончания"
                                            >
                                                <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Divider />

                                    {/* File Attachments */}
                                    <div>
                                        <Space style={{ marginBottom: 12 }}>
                                            <Title level={5} style={{ margin: 0 }}>
                                                Вложения
                                            </Title>
                                            <Badge
                                                count={fileListsBySubtask[subtaskType]?.length || 0}
                                                showZero
                                                style={{ backgroundColor: '#52c41a' }}
                                            />
                                        </Space>

                                        <Upload
                                            beforeUpload={(file) => {
                                                handleFileUpload(subtaskType, file);
                                                return false;
                                            }}
                                            onRemove={(file) => handleFileRemove(subtaskType, file)}
                                            fileList={fileListsBySubtask[subtaskType] || []}
                                            showUploadList={false}
                                        >
                                            <Button
                                                icon={<UploadOutlined />}
                                                loading={uploadingSubtask === subtaskType}
                                                disabled={uploadingSubtask !== null && uploadingSubtask !== subtaskType}
                                            >
                                                Загрузить файл
                                            </Button>
                                        </Upload>

                                        {fileListsBySubtask[subtaskType]?.length > 0 && (
                                            <List
                                                style={{ marginTop: 16 }}
                                                size="small"
                                                bordered
                                                dataSource={fileListsBySubtask[subtaskType]}
                                                renderItem={(file) => (
                                                    <List.Item
                                                        actions={[
                                                            <Button
                                                                key="download"
                                                                type="link"
                                                                size="small"
                                                                icon={<DownloadOutlined />}
                                                                onClick={() => {
                                                                    const link = document.createElement('a');
                                                                    link.href = file.url || '';
                                                                    link.download = file.name;
                                                                    document.body.appendChild(link);
                                                                    link.click();
                                                                    document.body.removeChild(link);
                                                                }}
                                                            >
                                                                Скачать
                                                            </Button>,
                                                            <Button
                                                                key="delete"
                                                                type="link"
                                                                size="small"
                                                                danger
                                                                icon={<DeleteOutlined />}
                                                                onClick={() => handleFileRemove(subtaskType, file)}
                                                            >
                                                                Удалить
                                                            </Button>,
                                                        ]}
                                                    >
                                                        <Space>
                                                            <PaperClipOutlined />
                                                            <Text>{file.name}</Text>
                                                        </Space>
                                                    </List.Item>
                                                )}
                                            />
                                        )}
                                    </div>
                                </TabPane>
                            );
                        })}
                    </Tabs>

                    <Divider />

                    <div style={{ textAlign: 'right' }}>
                        <Space size="middle">
                            <Button size="large" onClick={() => navigate('/tasks/list')}>
                                Отмена
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                icon={<SaveOutlined />}
                                loading={submitting}
                            >
                                Сохранить изменения
                            </Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default EditProcessTask;
