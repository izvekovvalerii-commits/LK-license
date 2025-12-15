import React from 'react';
import { Card, Row, Col } from 'antd';
import { FileTextOutlined, DollarOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Documents: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: 32, fontSize: '28px', fontWeight: 600, color: '#1f1f1f' }}>Документы</h1>

            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                <Row gutter={[32, 32]} style={{ width: '100%' }}>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => navigate('/documents/lease')}
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
                                <HomeOutlined style={{ fontSize: '40px', color: '#fa8c16' }} />
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: 8, color: '#262626' }}>Договоры аренды</div>
                            <div style={{ color: '#8c8c8c', fontSize: '16px' }}>Свидетельство права собственности</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => navigate('/payments')}
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
                                <DollarOutlined style={{ fontSize: '40px', color: '#52c41a' }} />
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: 8, color: '#262626' }}>Государственные пошлины</div>
                            <div style={{ color: '#8c8c8c', fontSize: '16px' }}>Платежные документы</div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => navigate('/documents/egrn')}
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
                            <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: 8, color: '#262626' }}>Выписки ЕГРН</div>
                            <div style={{ color: '#8c8c8c', fontSize: '16px' }}>Единый государственный реестр недвижимости</div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Documents;
