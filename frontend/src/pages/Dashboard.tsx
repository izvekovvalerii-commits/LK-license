import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../services/storeService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
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
        try {
            const licenses = await storeService.getLicenseStats();
            setLicenseStats(licenses);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <div className="dashboard">
            <h1 style={{ marginBottom: 24 }}>Панель управления</h1>

            {/* License Stats */}
            <Row gutter={[16, 16]} justify="center">
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
        </div >
    );
};

export default Dashboard;
