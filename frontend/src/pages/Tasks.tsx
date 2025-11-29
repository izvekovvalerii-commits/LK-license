import React from 'react';
import { Card, Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Icon from '@ant-design/icons';

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

    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: 32, fontSize: '28px', fontWeight: 600, color: '#1f1f1f' }}>Задачи</h1>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Row gutter={[32, 32]} style={{ width: '100%' }}>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/list')}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '280px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '32px' }}
                        >
                            <div style={{
                                background: '#e6f7ff',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px'
                            }}>
                                <FileTextOutlined style={{ fontSize: '40px', color: '#1890ff' }} />
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: 8, color: '#262626' }}>Мои задачи</div>
                            <div style={{ color: '#8c8c8c', fontSize: '16px' }}>Все задачи пользователя</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/create-alcohol')}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '280px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '32px' }}
                        >
                            <div style={{
                                background: '#f6ffed',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px'
                            }}>
                                <BottleIcon style={{ fontSize: '40px', color: '#52c41a' }} />
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: 8, color: '#262626' }}>Получить алкогольную лицензию</div>
                            <div style={{ color: '#8c8c8c', fontSize: '16px' }}>Создать задачу на алкоголь</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => navigate('/tasks/create-tobacco')}
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: '#fff',
                                height: '280px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                borderRadius: '16px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                border: '1px solid #f0f0f0',
                                transition: 'all 0.3s ease'
                            }}
                            bodyStyle={{ padding: '32px' }}
                        >
                            <div style={{
                                background: '#fff7e6',
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 24px'
                            }}>
                                <CigaretteIcon style={{ fontSize: '40px', color: '#faad14' }} />
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: 8, color: '#262626' }}>Получить табачную лицензию</div>
                            <div style={{ color: '#8c8c8c', fontSize: '16px' }}>Создать задачу на табак</div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Tasks;
