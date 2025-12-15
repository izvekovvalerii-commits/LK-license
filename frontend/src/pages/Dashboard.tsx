import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Tag, Skeleton } from 'antd';
import {
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/taskService';
import { storeService } from '../services/storeService';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import dayjs from 'dayjs';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<Task[]>([]);
    const [licenseStats, setLicenseStats] = useState({
        totalStores: 0,
        activeAlcohol: 0,
        expiringAlcohol: 0,
        activeTobacco: 0,
        expiringTobacco: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [
                allTasks,
                deadlines,
                licenses,
            ] = await Promise.all([
                taskService.getAllTasks(),
                taskService.getUpcomingDeadlines(14),
                storeService.getLicenseStats(),
            ]);

            setTasks(allTasks);
            setUpcomingDeadlines(deadlines);
            setLicenseStats(licenses);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Statistics
    const totalTasks = tasks.length;
    const assignedTasks = tasks.filter(t => t.status === TaskStatus.ASSIGNED).length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    const suspendedTasks = tasks.filter(t => t.status === TaskStatus.SUSPENDED).length;



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
            title: 'Тип лицензии',
            dataIndex: 'licenseType',
            key: 'licenseType',
            render: (type: string) => type === 'ALCOHOL' ? 'Алкогольная' : 'Табачная',
        },
        {
            title: 'Срок',
            dataIndex: 'deadlineDate',
            key: 'deadlineDate',
            render: (date: string) => date ? dayjs(date).format('DD.MM.YYYY') : '-',
        },
        {
            title: 'Осталось дней',
            dataIndex: 'deadlineDate',
            key: 'daysLeft',
            render: (date: string) => {
                if (!date) return '-';
                const days = dayjs(date).diff(dayjs(), 'days');
                const color = days < 3 ? 'red' : days < 7 ? 'orange' : 'green';
                return <Tag color={color}>{days} дн.</Tag>;
            },
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: TaskStatus) => (
                <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="dashboard">
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Stats Cards */}
            <Row gutter={[16, 16]} className="stats-row">
                <Col xs={12} sm={8} md={4}>
                    <Card
                        className="stat-card stat-card-total"
                        hoverable
                        onClick={() => navigate('/tasks')}
                    >
                        <div className="stat-content">
                            <FileTextOutlined className="stat-icon" />
                            <div className="stat-value">{totalTasks}</div>
                            <div className="stat-label">Всего задач</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card
                        className="stat-card stat-card-assigned"
                        hoverable
                        onClick={() => navigate('/tasks', { state: { filter: 'assigned' } })}
                    >
                        <div className="stat-content">
                            <ClockCircleOutlined className="stat-icon" />
                            <div className="stat-value">{assignedTasks}</div>
                            <div className="stat-label">Назначены</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card
                        className="stat-card stat-card-progress"
                        hoverable
                        onClick={() => navigate('/tasks', { state: { filter: 'in_progress' } })}
                    >
                        <div className="stat-content">
                            <PlayCircleOutlined className="stat-icon" />
                            <div className="stat-value">{inProgressTasks}</div>
                            <div className="stat-label">В работе</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card
                        className="stat-card stat-card-suspended"
                        hoverable
                        onClick={() => navigate('/tasks', { state: { filter: 'suspended' } })}
                    >
                        <div className="stat-content">
                            <PauseCircleOutlined className="stat-icon" />
                            <div className="stat-value">{suspendedTasks}</div>
                            <div className="stat-label">Приостановлены</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card
                        className="stat-card stat-card-deadlines"
                        hoverable
                        onClick={() => navigate('/tasks', { state: { filter: 'upcoming' } })}
                    >
                        <div className="stat-content">
                            <ClockCircleOutlined className="stat-icon" />
                            <div className="stat-value">{upcomingDeadlines.length}</div>
                            <div className="stat-label">Приближающиеся сроки</div>
                        </div>
                    </Card>
                </Col>
                <Col xs={12} sm={8} md={4}>
                    <Card
                        className="stat-card stat-card-completed"
                        hoverable
                        onClick={() => navigate('/tasks', { state: { filter: 'completed' } })}
                    >
                        <div className="stat-content">
                            <CheckCircleOutlined className="stat-icon" />
                            <div className="stat-value">{completedTasks}</div>
                            <div className="stat-label">Завершено</div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* License Stats */}
            <Row gutter={[16, 16]} justify="center" style={{ marginTop: 24 }}>
                <Col xs={24} sm={8} md={6}>
                    <Card
                        hoverable
                        onClick={() => navigate('/stores')}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #f0f0f0',
                            height: '100%'
                        }}
                        bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div style={{
                            background: '#e6f7ff',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <ShopOutlined style={{ fontSize: '28px', color: '#1890ff' }} />
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#262626', lineHeight: 1 }}>
                            {licenseStats.totalStores}
                        </div>
                        <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
                            Активных магазинов
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={8} md={6}>
                    <Card
                        hoverable
                        onClick={() => navigate('/stores')}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #f0f0f0',
                            height: '100%'
                        }}
                        bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div style={{
                            background: '#f6ffed',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 3L4 8V14C4 21.5 9.5 28.5 16 30C22.5 28.5 28 21.5 28 14V8L16 3Z" fill="#52c41a" fillOpacity="0.2" stroke="#52c41a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Bottle */}
                                <path d="M14 13h4v2.5l2 1.5v7.5c0 .6-.5 1-1 1h-6c-.5 0-1-.4-1-1V17l2-1.5V13z" fill="#52c41a" stroke="#52c41a" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                                {/* Bottle neck */}
                                <rect x="15.5" y="11.5" width="1" height="1.5" fill="#52c41a" />
                                <rect x="15" y="11.5" width="2" height="0.7" rx="0.35" fill="#52c41a" />
                            </svg>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#262626', lineHeight: 1 }}>
                            {licenseStats.activeAlcohol}
                        </div>
                        <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
                            Алкогольных лицензий
                        </div>
                        {licenseStats.expiringAlcohol > 0 && (
                            <Tag color="orange" style={{ marginTop: '12px', borderRadius: '12px' }}>
                                {licenseStats.expiringAlcohol} истекают
                            </Tag>
                        )}
                    </Card>
                </Col>
                <Col xs={24} sm={8} md={6}>
                    <Card
                        hoverable
                        onClick={() => navigate('/stores')}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid #f0f0f0',
                            height: '100%'
                        }}
                        bodyStyle={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <div style={{
                            background: '#fff7e6',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px'
                        }}>
                            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 3L4 8V14C4 21.5 9.5 28.5 16 30C22.5 28.5 28 21.5 28 14V8L16 3Z" fill="#faad14" fillOpacity="0.2" stroke="#faad14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <rect x="10" y="16" width="12" height="2.5" rx="1.25" fill="#faad14" />
                                <line x1="18" y1="16" x2="18" y2="18.5" stroke="#faad14" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M18 13.5l-1.2-1.2" stroke="#faad14" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M21 13.5l-1.2-1.2" stroke="#faad14" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#262626', lineHeight: 1 }}>
                            {licenseStats.activeTobacco}
                        </div>
                        <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
                            Табачных лицензий
                        </div>
                        {licenseStats.expiringTobacco > 0 && (
                            <Tag color="orange" style={{ marginTop: '12px', borderRadius: '12px' }}>
                                {licenseStats.expiringTobacco} истекают
                            </Tag>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Upcoming Deadlines Table */}
            <Card title="Задачи с приближающимися сроками" className="upcoming-deadlines-card" style={{ marginTop: 24 }}>
                <Table
                    columns={columns}
                    dataSource={upcomingDeadlines}
                    rowKey="id"
                    loading={loading}
                    onRow={(record) => ({
                        onClick: () => navigate(`/tasks/${record.id}`),
                        style: { cursor: 'pointer' },
                    })}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Нет задач с приближающимися сроками' }}
                />
            </Card>
        </div >
    );
};

export default Dashboard;
