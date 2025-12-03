import React, { useState, useEffect } from 'react';
import {
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
    Upload,
    List,
    Checkbox,
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
    PlusOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import type { Store, User, TaskRequest, Task, Payment } from '../types';
import { SubtaskType, TaskStatus, PaymentStatus } from '../types';
import { storeService } from '../services/storeService';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import { paymentService } from '../services/paymentService';
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

    const [payments, setPayments] = useState<Payment[]>([]);

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

            // Load payments
            try {
                const paymentsData = await paymentService.getTaskPayments(Number(id));
                setPayments(paymentsData);
            } catch (error) {
                console.error('Error loading payments:', error);
            }

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
            const selectedStore = taskData.storeId ? storesData.find(s => s.id === taskData.storeId) : null;

            form.setFieldsValue({
                title: taskData.title,
                description: taskData.description,
                licenseType: taskData.licenseType,
                actionType: taskData.actionType,
                storeId: taskData.storeId,
                assigneeId: taskData.assigneeId,
                deadlineDate: taskData.deadlineDate ? dayjs(taskData.deadlineDate) : undefined,
                status: taskData.status,
                // Сведения об объекте
                mvz: selectedStore?.mvz,
                tradingNetwork: 'network1', // TODO: добавить поле в Store
                region: selectedStore?.cfo,
                licensingAuthority: 'rosalko', // TODO: добавить поле в Store
                legalEntity: selectedStore?.be,
                licensePeriod: '5', // TODO: добавить поле в Store
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



    const handleSubmit = async (values: any) => {
        try {
            setSubmitting(true);

            // Check if token exists
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Сессия истекла. Пожалуйста, войдите заново.');
                navigate('/login');
                return;
            }

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

            console.log('Updating main task:', mainTaskData);
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

                    console.log(`Updating subtask ${subtask.subtaskType}:`, subtaskData);
                    await taskService.updateTask(subtask.id, subtaskData);
                }
            }

            message.success('Задача успешно обновлена');
            navigate('/tasks/list');
        } catch (error: any) {
            console.error('Error updating task:', error);
            console.error('Error response:', error.response);

            if (error.response?.status === 401) {
                message.error('Ошибка аутентификации. Сессия истекла.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else if (error.response?.status === 403) {
                message.error('Недостаточно прав для выполнения операции');
            } else if (error.response?.status === 400) {
                message.error('Некорректные данные: ' + (error.response?.data?.message || 'Проверьте заполнение всех полей'));
            } else {
                message.error('Ошибка при обновлении задачи: ' + (error.message || 'Неизвестная ошибка'));
            }
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

    const handleFileUpload = async (subtaskType: SubtaskType, file: File, categoryPrefix?: string) => {
        const subtask = subtasks.find(st => st.subtaskType === subtaskType);
        if (!subtask) {
            message.error('Подзадача не найдена');
            return false;
        }

        setUploadingSubtask(subtaskType);
        const formData = new FormData();

        if (categoryPrefix) {
            const newFileName = `${categoryPrefix}::${file.name}`;
            const newFile = new File([file], newFileName, { type: file.type });
            formData.append('file', newFile);
        } else {
            formData.append('file', file);
        }

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



    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Minimal Header */}
            <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/tasks/list')}
                        type="text"
                        style={{ fontSize: '16px' }}
                    />
                    <Title level={4} style={{ margin: 0 }}>{task.title}</Title>
                    {task.storeName && <Tag color="blue">{task.storeName}</Tag>}
                </div>
                <Badge
                    status={statusConfig[currentStatus].color as any}
                    text={<span style={{ fontWeight: 500 }}>{statusConfig[currentStatus].label}</span>}
                />
            </div>

            {/* Main Form */}
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
                        {/* Main Information Tab */}
                        <TabPane tab="Основная информация" key="main">
                            <div style={{
                                background: '#f0f2f5',
                                padding: '16px',
                                minHeight: 'calc(100vh - 200px)' // Adjust based on header/tabs height
                            }}>
                                <Row gutter={16}>
                                    {/* Left Column: Сведения об объекте & Оценка локации */}
                                    <Col xs={24} lg={12}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {/* Сведения об объекте */}
                                            <div style={{
                                                background: '#fff',
                                                borderRadius: '8px',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                padding: '16px',
                                                border: '1px solid #e8e8e8'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                                    <InfoCircleOutlined style={{ fontSize: '16px', color: '#1890ff', marginRight: '8px' }} />
                                                    <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>
                                                        Сведения об объекте
                                                    </Title>
                                                </div>

                                                <Row gutter={[12, 12]}>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            name="mvz"
                                                            label={<Text type="secondary" style={{ fontSize: '11px' }}>МВЗ</Text>}
                                                            rules={[{ required: true, message: 'Выберите МВЗ' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Выберите МВЗ"
                                                                disabled={!task?.storeId}
                                                                size="middle"
                                                                variant="borderless"
                                                                style={{
                                                                    borderBottom: '1px solid #d9d9d9',
                                                                    padding: 0,
                                                                    fontSize: '13px'
                                                                }}
                                                            >
                                                                {stores.map((store) => (
                                                                    <Select.Option key={store.id} value={store.mvz}>
                                                                        {store.mvz}
                                                                    </Select.Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24} md={12}>
                                                        <Form.Item
                                                            name="tradingNetwork"
                                                            label={<Text type="secondary" style={{ fontSize: '11px' }}>Торговая сеть</Text>}
                                                            rules={[{ required: true, message: 'Выберите торговую сеть' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Выберите торговую сеть"
                                                                size="middle"
                                                                variant="borderless"
                                                                style={{ borderBottom: '1px solid #d9d9d9', fontSize: '13px' }}
                                                            >
                                                                <Select.Option value="network1">Сеть 1</Select.Option>
                                                                <Select.Option value="network2">Сеть 2</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24}>
                                                        <Form.Item
                                                            name="region"
                                                            label={<Text type="secondary" style={{ fontSize: '11px' }}>Субъект РФ</Text>}
                                                            rules={[{ required: true, message: 'Выберите субъект РФ' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Выберите субъект РФ"
                                                                size="middle"
                                                                variant="borderless"
                                                                style={{ borderBottom: '1px solid #d9d9d9', fontSize: '13px' }}
                                                            >
                                                                <Select.Option value="moscow">Москва</Select.Option>
                                                                <Select.Option value="spb">Санкт-Петербург</Select.Option>
                                                                <Select.Option value="mo">Московская область</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24}>
                                                        <Form.Item
                                                            name="licensingAuthority"
                                                            label={<Text type="secondary" style={{ fontSize: '11px' }}>Лицензирующий орган</Text>}
                                                            rules={[{ required: true, message: 'Выберите лицензирующий орган' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Выберите лицензирующий орган"
                                                                size="middle"
                                                                variant="borderless"
                                                                style={{ borderBottom: '1px solid #d9d9d9', fontSize: '13px' }}
                                                            >
                                                                <Select.Option value="rosalko">Росалкогольрегулирование</Select.Option>
                                                                <Select.Option value="regional">Региональный орган</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24}>
                                                        <Form.Item
                                                            name="legalEntity"
                                                            label={<Text type="secondary" style={{ fontSize: '11px' }}>Юридическое лицо</Text>}
                                                            rules={[{ required: true, message: 'Выберите юридическое лицо' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Выберите юридическое лицо"
                                                                size="middle"
                                                                variant="borderless"
                                                                style={{ borderBottom: '1px solid #d9d9d9', fontSize: '13px' }}
                                                            >
                                                                <Select.Option value="entity1">ООО "Компания 1"</Select.Option>
                                                                <Select.Option value="entity2">ООО "Компания 2"</Select.Option>
                                                            </Select>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={24}>
                                                        <Form.Item
                                                            name="licensePeriod"
                                                            label={<Text type="secondary" style={{ fontSize: '11px' }}>Период лицензирования</Text>}
                                                            rules={[{ required: true, message: 'Введите период лицензирования' }]}
                                                            initialValue="5"
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Input
                                                                placeholder="5"
                                                                type="number"
                                                                size="middle"
                                                                suffix={<span style={{ color: '#bfbfbf', fontSize: '12px' }}>лет</span>}
                                                                bordered={false}
                                                                style={{ borderBottom: '1px solid #d9d9d9', paddingLeft: 0, fontSize: '13px' }}
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </div>

                                            {/* Оценка локации объекта */}
                                            <div style={{
                                                background: '#fff',
                                                borderRadius: '8px',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                padding: '16px',
                                                border: '1px solid #e8e8e8'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '16px'
                                                }}>
                                                    <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>
                                                        Оценка локации объекта
                                                    </Title>
                                                    <Button type="link" size="small" style={{ padding: 0, fontWeight: 500, fontSize: '12px' }}>
                                                        Запросить
                                                    </Button>
                                                </div>

                                                <Form.Item
                                                    name="gisAssessmentDate"
                                                    label={<Text type="secondary" style={{ fontSize: '11px' }}>Дата оценки</Text>}
                                                    rules={[{ required: true, message: 'Выберите дату оценки' }]}
                                                    style={{ marginBottom: '12px' }}
                                                >
                                                    <DatePicker
                                                        style={{ width: '100%' }}
                                                        placeholder="Выберите дату"
                                                        format="DD.MM.YYYY"
                                                        size="middle"
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    name="gisAssessmentComment"
                                                    label={<Text type="secondary" style={{ fontSize: '11px' }}>Оценка</Text>}
                                                    rules={[{ required: true, message: 'Введите оценку' }]}
                                                    style={{ marginBottom: 0 }}
                                                >
                                                    <TextArea
                                                        placeholder="Введите текст оценки"
                                                        autoSize={{ minRows: 2, maxRows: 4 }}
                                                        showCount
                                                        maxLength={2000}
                                                        style={{ fontSize: '13px' }}
                                                    />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </Col>

                                    {/* Right Column: Общие данные и Мои задачи */}
                                    <Col xs={24} lg={12}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                            {/* Общие данные */}
                                            <div style={{
                                                background: '#fff',
                                                borderRadius: '8px',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                padding: '16px',
                                                border: '1px solid #e8e8e8'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                                                    <ClockCircleOutlined style={{ fontSize: '16px', color: '#1890ff', marginRight: '8px' }} />
                                                    <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>
                                                        Общие данные
                                                    </Title>
                                                </div>

                                                <Row gutter={[12, 12]}>
                                                    <Col xs={12}>
                                                        <div>
                                                            <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}>
                                                                ДАТА СОЗДАНИЯ
                                                            </Text>
                                                            <Text style={{ fontSize: '13px', fontWeight: 500 }}>
                                                                {task?.createdAt ? dayjs(task.createdAt).format('DD.MM.YYYY') : '01.10.2025'}
                                                            </Text>
                                                        </div>
                                                    </Col>

                                                    <Col xs={12}>
                                                        <div>
                                                            <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}>
                                                                ДАТА ЗАВЕРШЕНИЯ
                                                            </Text>
                                                            <Text style={{ fontSize: '13px', fontWeight: 500, color: task?.status === TaskStatus.DONE ? '#52c41a' : 'inherit' }}>
                                                                {task?.status === TaskStatus.DONE && task?.updatedAt
                                                                    ? dayjs(task.updatedAt).format('DD.MM.YYYY')
                                                                    : '—'}
                                                            </Text>
                                                        </div>
                                                    </Col>
                                                </Row>

                                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            background: '#f0f0f0',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '10px',
                                                            fontWeight: 600,
                                                            color: '#595959'
                                                        }}>
                                                            ИИ
                                                        </div>
                                                        <div>
                                                            <Text type="secondary" style={{ fontSize: '9px', display: 'block', textTransform: 'uppercase' }}>
                                                                Исполнитель
                                                            </Text>
                                                            <Text style={{ fontSize: '12px', fontWeight: 500 }}>
                                                                {task?.assigneeName || 'Иванов Иван Иванович'}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Мои задачи */}
                                            <div style={{
                                                background: '#fff',
                                                borderRadius: '8px',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                padding: '16px',
                                                border: '1px solid #e8e8e8',
                                                flex: 1
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: '16px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <CheckCircleOutlined style={{ fontSize: '16px', color: '#1890ff', marginRight: '8px' }} />
                                                        <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: '14px' }}>
                                                            Мои задачи
                                                        </Title>
                                                        <span style={{
                                                            marginLeft: '8px',
                                                            fontSize: '10px',
                                                            color: '#8c8c8c',
                                                            background: '#f5f5f5',
                                                            padding: '1px 6px',
                                                            borderRadius: '8px'
                                                        }}>
                                                            {subtasks.filter(st => st.status === TaskStatus.DONE).length}/{subtasks.length}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="text"
                                                        size="small"
                                                        icon={<PlusOutlined />}
                                                        style={{ color: '#8c8c8c' }}
                                                    />
                                                </div>

                                                <List
                                                    dataSource={subtasks}
                                                    split={false}
                                                    locale={{ emptyText: 'Нет подзадач' }}
                                                    renderItem={(subtask, index) => {
                                                        const isCompleted = subtask.status === TaskStatus.DONE;

                                                        return (
                                                            <div
                                                                key={subtask.id}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    padding: '8px 0',
                                                                    borderBottom: '1px solid #f0f0f0',
                                                                    gap: '8px',
                                                                    opacity: isCompleted ? 0.5 : 1,
                                                                    transition: 'opacity 0.2s'
                                                                }}
                                                            >
                                                                <div style={{
                                                                    color: '#d9d9d9',
                                                                    cursor: 'grab',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    gap: '2px',
                                                                    padding: '2px'
                                                                }}>
                                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                                        <div style={{ width: '2px', height: '2px', background: '#bfbfbf', borderRadius: '50%' }}></div>
                                                                        <div style={{ width: '2px', height: '2px', background: '#bfbfbf', borderRadius: '50%' }}></div>
                                                                    </div>
                                                                    <div style={{ display: 'flex', gap: '2px' }}>
                                                                        <div style={{ width: '2px', height: '2px', background: '#bfbfbf', borderRadius: '50%' }}></div>
                                                                        <div style={{ width: '2px', height: '2px', background: '#bfbfbf', borderRadius: '50%' }}></div>
                                                                    </div>
                                                                </div>

                                                                <Checkbox
                                                                    checked={isCompleted}
                                                                    onChange={(e) => {
                                                                        const newStatus = e.target.checked ? TaskStatus.DONE : TaskStatus.ASSIGNED;
                                                                        if (subtask.subtaskType) {
                                                                            handleSubtaskStatusChange(subtask.id, newStatus, subtask.subtaskType);
                                                                        }
                                                                    }}
                                                                />

                                                                <div style={{
                                                                    flex: 1,
                                                                    fontSize: '13px',
                                                                    textDecoration: isCompleted ? 'line-through' : 'none',
                                                                    lineHeight: '1.2'
                                                                }}>
                                                                    {subtask.subtaskType ? subtaskLabels[subtask.subtaskType] : subtask.title}
                                                                </div>

                                                                {index === 1 && (
                                                                    <div style={{ width: '60px' }}>
                                                                        <Progress
                                                                            percent={70}
                                                                            size="small"
                                                                            showInfo={false}
                                                                            strokeColor="#1890ff"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
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

                                    {subtaskType !== 'DOCUMENT_UPLOAD' && subtaskType !== 'STATE_FEE_PAYMENT' && (
                                        <>
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
                                        </>
                                    )}

                                    <Divider />

                                    {/* File Attachments */}
                                    {subtaskType === 'DOCUMENT_UPLOAD' ? (
                                        <Row gutter={[16, 16]}>
                                            {[
                                                { id: 'lease', title: 'Договор аренды' },
                                                { id: 'kpp', title: 'КПП' },
                                                { id: 'tech_plan', title: 'Тех. план' },
                                                { id: 'title_docs', title: 'Правоустанавливающие документы' },
                                                { id: 'egrn', title: 'Выписка из ЕГРН', actions: ['select', 'request'] },
                                                { id: 'state_fee', title: 'Оплата ГП', actions: ['select', 'request'] },
                                            ].map(category => {
                                                const categoryFiles = fileListsBySubtask[subtaskType]?.filter(f => f.name.startsWith(`${category.id}::`)) || [];

                                                return (
                                                    <Col xs={24} sm={12} md={8} lg={6} key={category.id}>
                                                        <div style={{
                                                            background: '#fff',
                                                            padding: '16px',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                            border: '1px solid #f0f0f0',
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                            <div>
                                                                <Title level={5} style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, minHeight: '44px' }}>
                                                                    {category.title}
                                                                </Title>

                                                                {categoryFiles.length > 0 ? (
                                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                                                                        {categoryFiles.map(file => (
                                                                            <div
                                                                                key={file.uid}
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    background: '#f5f5f5',
                                                                                    padding: '4px 8px',
                                                                                    borderRadius: '4px',
                                                                                    fontSize: '12px',
                                                                                    color: '#595959',
                                                                                    maxWidth: '100%',
                                                                                    overflow: 'hidden'
                                                                                }}
                                                                            >
                                                                                <PaperClipOutlined style={{ marginRight: '4px' }} />
                                                                                <span style={{ marginRight: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                                    {file.name.split('::')[1] || file.name}
                                                                                </span>
                                                                                <DeleteOutlined
                                                                                    style={{ cursor: 'pointer', color: '#bfbfbf' }}
                                                                                    onClick={() => handleFileRemove(subtaskType, file)}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div style={{ color: '#bfbfbf', fontSize: '12px', marginBottom: '12px', fontStyle: 'italic' }}>
                                                                        Нет файлов
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <Space size="small" wrap style={{ justifyContent: 'flex-end' }}>
                                                                {category.actions?.includes('select') && (
                                                                    <Button type="link" size="small" style={{ padding: 0 }}>Выбрать</Button>
                                                                )}
                                                                <Upload
                                                                    beforeUpload={(file) => {
                                                                        handleFileUpload(subtaskType, file, category.id);
                                                                        return false;
                                                                    }}
                                                                    showUploadList={false}
                                                                >
                                                                    <Button type="link" size="small" style={{ padding: 0 }}>Добавить</Button>
                                                                </Upload>
                                                                {category.actions?.includes('request') && (
                                                                    <Button type="link" size="small" style={{ padding: 0 }}>Запросить</Button>
                                                                )}
                                                            </Space>
                                                        </div>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    ) : (
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
                                    )}

                                    {subtaskType === 'STATE_FEE_PAYMENT' && (
                                        <div style={{ marginTop: 16 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                                <Title level={5} style={{ margin: 0 }}>Платежи</Title>
                                                <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('Функционал добавления платежа')}>
                                                    Добавить платеж
                                                </Button>
                                            </div>

                                            <Row gutter={[16, 16]}>
                                                {payments.map(payment => (
                                                    <Col xs={24} sm={12} md={8} lg={6} key={payment.id}>
                                                        <div
                                                            style={{
                                                                background: '#fff',
                                                                padding: '16px',
                                                                borderRadius: '8px',
                                                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                                                border: '1px solid #f0f0f0',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.3s'
                                                            }}
                                                            onClick={() => message.info(`Открытие платежа #${payment.id}`)}
                                                            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                                                            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)'}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                                                <div style={{ fontSize: '18px', fontWeight: 600 }}>
                                                                    {payment.amount.toLocaleString('ru-RU')} ₽
                                                                </div>
                                                                <Badge
                                                                    status={payment.status === PaymentStatus.PAID ? 'success' : payment.status === PaymentStatus.PENDING ? 'processing' : 'error'}
                                                                    text={payment.status === PaymentStatus.PAID ? 'Оплачен' : payment.status === PaymentStatus.PENDING ? 'Ожидает' : 'Ошибка'}
                                                                />
                                                            </div>
                                                            <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                                                                {payment.paymentDate ? dayjs(payment.paymentDate).format('DD.MM.YYYY') : 'Дата не указана'}
                                                            </div>
                                                            {payment.notes && (
                                                                <div style={{ marginTop: 8, color: '#595959', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                    {payment.notes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Col>
                                                ))}
                                                {payments.length === 0 && (
                                                    <Col span={24}>
                                                        <div style={{ textAlign: 'center', padding: '32px', color: '#bfbfbf', background: '#fafafa', borderRadius: '8px', border: '1px dashed #d9d9d9' }}>
                                                            Нет платежей
                                                        </div>
                                                    </Col>
                                                )}
                                            </Row>
                                        </div>
                                    )}
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
            </div>
        </div>
    );
};

export default EditProcessTask;
