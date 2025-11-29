import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import {
    FileTextOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { taskService } from '../services/taskService';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import dayjs from 'dayjs';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(false);
    const [upcomingDeadlines, setUpcomingDeadlines] = useState<Task[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allTasks, deadlines] = await Promise.all([
                taskService.getAllTasks(),
                taskService.getUpcomingDeadlines(14),
            ]);
            setTasks(allTasks);
            setUpcomingDeadlines(deadlines);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalTasks = tasks.length;
    const activeTasks = tasks.filter(t =>
        t.status !== TaskStatus.DONE
    ).length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const inProgressTasks = tasks.filter(t =>
        t.status === TaskStatus.IN_PROGRESS
    ).length;

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

    return (
        <div className="dashboard">
            <h1 className="page-title">Главная панель</h1>

            <Row gutter={[16, 16]} className="dashboard-stats">
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Всего задач"
                            value={totalTasks}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Активных задач"
                            value={activeTasks}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Завершено"
                            value={completedTasks}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="В работе"
                            value={inProgressTasks}
                            prefix={<DollarOutlined />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card title="Задачи с приближающимися сроками" className="upcoming-deadlines-card">
                <Table
                    columns={columns}
                    dataSource={upcomingDeadlines}
                    rowKey="id"
                    loading={loading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Нет задач с приближающимися сроками' }}
                />
            </Card>
        </div>
    );
};

export default Dashboard;
