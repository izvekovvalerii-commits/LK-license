import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Tag, Space, Spin, message, Select } from 'antd';
import { SendOutlined, PlusOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '@ant-design/icons';
import type { Task } from '../types';
import { taskService } from '../services/taskService';
import dayjs from 'dayjs';

const BottleSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.6 5.8V3h-5.2v2.8L7 9.5V20c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V9.5l-2.4-3.7zM15 20H9v-9.8l2.2-3.4V4h1.6v2.8L15 10.2V20z" />
    </svg>
);

const CigaretteSvg = () => (
    <svg width="1em" height="1em" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="10" width="20" height="4" rx="2" />
        <line x1="18" y1="10" x2="18" y2="14" />
        <path d="M18 7l-2-2" />
        <path d="M22 7l-2-2" />
        <path d="M14 7l-2-2" />
    </svg>
);

const BottleIcon = (props: any) => <Icon component={BottleSvg} {...props} />;
const CigaretteIcon = (props: any) => <Icon component={CigaretteSvg} {...props} />;

const Tasks: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [myTasks, setMyTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showTaskActions, setShowTaskActions] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('all');

    useEffect(() => {
        loadMyTasks();
        if (location.state?.filter) {
            setActiveFilter(location.state.filter);
        }
    }, [location.state]);

    const loadMyTasks = async () => {
        try {
            setLoading(true);
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const allTasks = await taskService.getAllTasks();

            const isAdmin = user.roles?.includes('ROLE_ADMIN');
            const filteredTasks = isAdmin
                ? allTasks
                : allTasks.filter(task => task.assigneeId === user.id);

            setMyTasks(filteredTasks);
        } catch (error) {
            message.error('Ошибка загрузки задач');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredTasks = () => {
        switch (activeFilter) {
            case 'assigned':
                return myTasks.filter(task => task.status === 'ASSIGNED');
            case 'in_progress':
                return myTasks.filter(task => task.status === 'IN_PROGRESS');
            case 'suspended':
                return myTasks.filter(task => task.status === 'SUSPENDED');
            case 'completed':
                return myTasks.filter(task => task.status === 'DONE');
            case 'upcoming':
                const today = dayjs();
                const twoWeeksLater = today.add(14, 'days');
                return myTasks.filter(task => {
                    if (!task.deadlineDate) return false;
                    const deadline = dayjs(task.deadlineDate);
                    return deadline.isAfter(today) && deadline.isBefore(twoWeeksLater);
                });
            default:
                return myTasks;
        }
    };

    const getFilterLabel = () => {
        const labels: Record<string, string> = {
            all: 'Все задачи',
            assigned: 'Назначенные',
            in_progress: 'В работе',
            suspended: 'Приостановленные',
            completed: 'Завершенные',
            upcoming: 'С приближающимися сроками',
        };
        return labels[activeFilter] || 'Мои задачи';
    };

    const getStatusTag = (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
            ASSIGNED: { color: 'blue', text: 'Назначена' },
            IN_PROGRESS: { color: 'orange', text: 'В работе' },
            DONE: { color: 'green', text: 'Завершена' },
            SUSPENDED: { color: 'red', text: 'Приостановлена' },
        };
        const config = statusMap[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const columns = [
        {
            title: 'Название',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: Task) => (
                <a onClick={() => navigate(`/tasks/${record.id}`)}>{text}</a>
            ),
        },
        {
            title: 'Тип лицензии',
            dataIndex: 'licenseType',
            key: 'licenseType',
            render: (type: string) => (
                type === 'ALCOHOL' ? (
                    <Space>
                        <BottleIcon style={{ color: '#52c41a' }} />
                        <span>Алкогольная</span>
                    </Space>
                ) : (
                    <Space>
                        <CigaretteIcon style={{ color: '#faad14' }} />
                        <span>Табачная</span>
                    </Space>
                )
            ),
        },
        {
            title: 'Действие',
            dataIndex: 'actionType',
            key: 'actionType',
            render: (type: string) => (
                type === 'NEW' ? 'Новая' : 'Продление'
            ),
        },
        {
            title: 'Магазин',
            dataIndex: 'storeName',
            key: 'storeName',
            render: (name: string) => name || '-',
        },
        {
            title: 'Ответственный',
            dataIndex: 'assigneeName',
            key: 'assigneeName',
            render: (name: string) => name || '-',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => getStatusTag(status),
        },
        {
            title: 'Срок',
            dataIndex: 'deadlineDate',
            key: 'deadlineDate',
            render: (date: string) => date ? new Date(date).toLocaleDateString('ru-RU') : '-',
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Action Tiles */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={24}>
                    <Card
                        hoverable
                        onClick={() => setShowTaskActions(!showTaskActions)}
                        style={{
                            cursor: 'pointer',
                            textAlign: 'center',
                            background: showTaskActions ? '#f0f5ff' : '#fff',
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: showTaskActions ? '2px solid #1890ff' : '1px solid #f0f0f0',
                            transition: 'all 0.3s ease',
                            padding: '20px'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                            <PlusOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                            <span style={{ fontSize: '18px', fontWeight: 600, color: '#262626' }}>Новая задача</span>
                            {showTaskActions ?
                                <UpOutlined style={{ fontSize: '16px', color: '#1890ff' }} /> :
                                <DownOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
                            }
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Expandable Task Actions */}
            {showTaskActions && (
                <Row gutter={[16, 16]} justify="space-between" style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/create-alcohol')}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '140px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '20px' }}
                            className="action-card"
                        >
                            <div style={{
                                background: '#f6ffed',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 10px'
                            }}>
                                <BottleIcon style={{ fontSize: '24px', color: '#52c41a' }} />
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#262626', lineHeight: '1.3' }}>Получить алкогольную лицензию</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/create-tobacco')}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '140px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '20px' }}
                            className="action-card"
                        >
                            <div style={{
                                background: '#fff7e6',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 10px'
                            }}>
                                <CigaretteIcon style={{ fontSize: '24px', color: '#faad14' }} />
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#262626', lineHeight: '1.3' }}>Получить табачную лицензию</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/create-alcohol', { state: { actionType: 'RENEWAL' } })}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '140px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '20px' }}
                            className="action-card"
                        >
                            <div style={{
                                background: '#e6fffb',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 10px'
                            }}>
                                <BottleIcon style={{ fontSize: '24px', color: '#13c2c2' }} />
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#262626', lineHeight: '1.3' }}>Продлить алкогольную лицензию</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/create-tobacco', { state: { actionType: 'RENEWAL' } })}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '140px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '20px' }}
                            className="action-card"
                        >
                            <div style={{
                                background: '#fff1f0',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 10px'
                            }}>
                                <CigaretteIcon style={{ fontSize: '24px', color: '#ff4d4f' }} />
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#262626', lineHeight: '1.3' }}>Продлить табачную лицензию</div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/send-email')}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '140px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '20px' }}
                            className="action-card"
                        >
                            <div style={{
                                background: '#f9f0ff',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 10px'
                            }}>
                                <SendOutlined style={{ fontSize: '24px', color: '#722ed1' }} />
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#262626', lineHeight: '1.3' }}>Отправить данные</div>
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Tasks Table */}
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: 500 }}>{getFilterLabel()}</span>
                        <Select
                            value={activeFilter}
                            onChange={setActiveFilter}
                            style={{ width: 220 }}
                            options={[
                                { value: 'all', label: 'Все задачи' },
                                { value: 'assigned', label: 'Назначенные' },
                                { value: 'in_progress', label: 'В работе' },
                                { value: 'suspended', label: 'Приостановленные' },
                                { value: 'completed', label: 'Завершенные' },
                                { value: 'upcoming', label: 'Приближающиеся сроки' },
                            ]}
                        />
                    </div>
                }
                style={{
                    borderRadius: '8px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}
                headStyle={{
                    borderBottom: '1px solid #f0f0f0',
                    fontWeight: 500
                }}
            >
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={getFilteredTasks()}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Всего задач: ${total}`,
                        }}
                        locale={{
                            emptyText: 'Нет задач'
                        }}
                    />
                )}
            </Card>

            <style>{`
                .action-card:hover {
                    border-color: #d9d9d9;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
                    transform: translateY(-4px) scale(1.02);
                }

                .ant-table-tbody > tr {
                    transition: background 0.2s ease;
                }

                .ant-table-tbody > tr:hover {
                    background: #fafafa;
                }
            `}</style>
        </div>
    );
};

export default Tasks;
