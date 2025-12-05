import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Tag, Modal, Select, Button, message, Alert, Collapse } from 'antd';
import { ShopOutlined, FileTextOutlined, DollarOutlined, HomeOutlined, EnvironmentOutlined, SearchOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { Store } from '../types';
import { useNavigate } from 'react-router-dom';
import { storeService } from '../services/storeService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [licenseStats, setLicenseStats] = useState({
        totalStores: 0,
        activeAlcohol: 0,
        expiringAlcohol: 0,
        expiredAlcohol: 0,
        activeTobacco: 0,
        expiringTobacco: 0,
        expiredTobacco: 0,
    });

    // Mock trend data (last 7 days) - in real app, this would come from API
    const trendData = {
        stores: [115, 117, 118, 119, 120, 120, 120],
        alcohol: [44, 45, 45, 46, 46, 46, 46],
        tobacco: [35, 36, 36, 37, 37, 37, 37],
    };

    const navigate = useNavigate();

    // FIAS modal state
    const [isFiasModalOpen, setIsFiasModalOpen] = useState(false);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [loadingStores, setLoadingStores] = useState(false);

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

    const loadStores = async () => {
        setLoadingStores(true);
        try {
            const data = await storeService.getAllStores();
            setStores(data);
        } catch (error) {
            message.error('Ошибка загрузки магазинов');
        } finally {
            setLoadingStores(false);
        }
    };

    const handleOpenFiasModal = () => {
        setIsFiasModalOpen(true);
        loadStores();
    };

    const handleCloseFiasModal = () => {
        setIsFiasModalOpen(false);
        setSelectedStore(null);
    };

    const handleStoreSelect = (storeId: number) => {
        const store = stores.find(s => s.id === storeId);
        setSelectedStore(store || null);
    };

    const handleVerifyAddress = () => {
        if (!selectedStore) {
            message.warning('Выберите магазин');
            return;
        }
        message.success('Адрес магазина соответствует данным ФИАС', 5);
    };

    // State for dismissible alerts
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>(() => {
        const saved = localStorage.getItem('dismissedAlerts');
        return saved ? JSON.parse(saved) : [];
    });

    const handleDismissAlert = (alertId: string) => {
        const newDismissed = [...dismissedAlerts, alertId];
        setDismissedAlerts(newDismissed);
        localStorage.setItem('dismissedAlerts', JSON.stringify(newDismissed));
    };

    const isAlertDismissed = (alertId: string) => dismissedAlerts.includes(alertId);

    return (
        <div className="dashboard">
            {/* Critical Notifications */}
            <div style={{ marginBottom: 24 }}>
                {/* Expired Licenses Alert */}
                {licenseStats.expiredAlcohol > 0 && !isAlertDismissed('expired-alcohol') && (
                    <Alert
                        message="Истекшие алкогольные лицензии"
                        description={`Обнаружено ${licenseStats.expiredAlcohol} истекших алкогольных лицензий. Требуется срочное продление.`}
                        type="error"
                        showIcon
                        closable
                        onClose={() => handleDismissAlert('expired-alcohol')}
                        style={{ marginBottom: 16 }}
                        action={
                            <Button size="small" danger onClick={() => navigate('/references/alcohol')}>
                                Перейти к лицензиям
                            </Button>
                        }
                    />
                )}

                {licenseStats.expiredTobacco > 0 && !isAlertDismissed('expired-tobacco') && (
                    <Alert
                        message="Истекшие табачные лицензии"
                        description={`Обнаружено ${licenseStats.expiredTobacco} истекших табачных лицензий. Требуется срочное продление.`}
                        type="error"
                        showIcon
                        closable
                        onClose={() => handleDismissAlert('expired-tobacco')}
                        style={{ marginBottom: 16 }}
                        action={
                            <Button size="small" danger onClick={() => navigate('/references/tobacco')}>
                                Перейти к лицензиям
                            </Button>
                        }
                    />
                )}

                {/* Expiring Soon Licenses Alert */}
                {licenseStats.expiringAlcohol > 0 && !isAlertDismissed('expiring-alcohol') && (
                    <Alert
                        message="Истекающие алкогольные лицензии"
                        description={`${licenseStats.expiringAlcohol} алкогольных лицензий истекают в ближайшие 30 дней. Рекомендуется начать процесс продления.`}
                        type="warning"
                        showIcon
                        closable
                        onClose={() => handleDismissAlert('expiring-alcohol')}
                        style={{ marginBottom: 16 }}
                        action={
                            <Button size="small" onClick={() => navigate('/references/alcohol')}>
                                Просмотреть
                            </Button>
                        }
                    />
                )}

                {licenseStats.expiringTobacco > 0 && !isAlertDismissed('expiring-tobacco') && (
                    <Alert
                        message="Истекающие табачные лицензии"
                        description={`${licenseStats.expiringTobacco} табачных лицензий истекают в ближайшие 30 дней. Рекомендуется начать процесс продления.`}
                        type="warning"
                        showIcon
                        closable
                        onClose={() => handleDismissAlert('expiring-tobacco')}
                        style={{ marginBottom: 16 }}
                        action={
                            <Button size="small" onClick={() => navigate('/references/tobacco')}>
                                Просмотреть
                            </Button>
                        }
                    />
                )}
            </div>


            {/* Actions Section */}
            <Row style={{ marginBottom: 32 }}>
                <Col span={24}>
                    <Collapse
                        defaultActiveKey={['actions']}
                        style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}
                        items={[
                            {
                                key: 'actions',
                                label: <span style={{ fontSize: '20px', fontWeight: 600 }}>Действия</span>,
                                children: (
                                    <Row gutter={[24, 24]}>
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile"
                                                onClick={() => navigate('/documents/lease')}
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
                                                    <HomeOutlined style={{ fontSize: '28px', color: '#fa8c16' }} />
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 6, color: '#262626' }}>Договоры аренды</div>
                                                <div style={{ color: '#8c8c8c', fontSize: '12px', lineHeight: '1.4' }}>Свидетельство права собственности</div>
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile"
                                                onClick={() => navigate('/payments')}
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
                                                    <DollarOutlined style={{ fontSize: '28px', color: '#52c41a' }} />
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 6, color: '#262626' }}>Государственные пошлины</div>
                                                <div style={{ color: '#8c8c8c', fontSize: '12px', lineHeight: '1.4' }}>Платежные документы</div>
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile"
                                                onClick={() => navigate('/documents/egrn-list')}
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
                                                    <FileTextOutlined style={{ fontSize: '28px', color: '#1890ff' }} />
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 6, color: '#262626' }}>Выписки ЕГРН</div>
                                                <div style={{ color: '#8c8c8c', fontSize: '12px', lineHeight: '1.4' }}>Единый государственный реестр недвижимости</div>
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile"
                                                onClick={() => navigate('/documents/gis')}
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
                                                    background: '#f9f0ff',
                                                    width: '56px',
                                                    height: '56px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: '16px'
                                                }}>
                                                    <EnvironmentOutlined style={{ fontSize: '28px', color: '#722ed1' }} />
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 6, color: '#262626' }}>Анализ локации в ГИС</div>
                                                <div style={{ color: '#8c8c8c', fontSize: '12px', lineHeight: '1.4' }}>Геоинформационный анализ территории</div>
                                            </Card>
                                        </Col>
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile"
                                                onClick={handleOpenFiasModal}
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
                                                    <SearchOutlined style={{ fontSize: '28px', color: '#1890ff' }} />
                                                </div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 6, color: '#262626' }}>Поверка адреса ФИАС</div>
                                                <div style={{ color: '#8c8c8c', fontSize: '12px', lineHeight: '1.4' }}>Проверка адреса магазина</div>
                                            </Card>
                                        </Col>
                                    </Row>
                                )
                            }
                        ]}
                    />
                </Col>
            </Row>

            {/* References Section */}
            <Row style={{ marginBottom: 32 }}>
                <Col span={24}>
                    <Collapse
                        defaultActiveKey={['references']}
                        style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: 'none' }}
                        items={[
                            {
                                key: 'references',
                                label: <span style={{ fontSize: '20px', fontWeight: 600 }}>Справочники</span>,
                                children: (
                                    <Row gutter={[24, 24]}>
                                        {/* Stores Tile */}
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile enhanced-tile"
                                                onClick={() => navigate('/stores')}
                                                style={{
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    borderRadius: '16px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                    border: '1px solid #f0f0f0',
                                                    height: '100%',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#262626', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {licenseStats.totalStores}
                                                    <span style={{ fontSize: '14px', color: '#52c41a', display: 'flex', alignItems: 'center' }}>
                                                        <ArrowUpOutlined style={{ fontSize: '12px' }} />
                                                        {((trendData.stores[trendData.stores.length - 1] - trendData.stores[0]) / trendData.stores[0] * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
                                                    Активных магазинов
                                                </div>
                                            </Card>
                                        </Col>

                                        {/* Alcohol Licenses Tile */}
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile enhanced-tile"
                                                onClick={() => navigate('/references/alcohol')}
                                                style={{
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    borderRadius: '16px',
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                    border: '1px solid #f0f0f0',
                                                    height: '100%',
                                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                                                        <path d="M14 13h4v2.5l2 1.5v7.5c0 .6-.5 1-1 1h-6c-.5 0-1-.4-1-1V17l2-1.5V13z" fill="#52c41a" stroke="#52c41a" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <rect x="15.5" y="11.5" width="1" height="1.5" fill="#52c41a" />
                                                        <rect x="15" y="11.5" width="2" height="0.7" rx="0.35" fill="#52c41a" />
                                                    </svg>
                                                </div>
                                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#262626', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {licenseStats.activeAlcohol}
                                                    <span style={{ fontSize: '14px', color: '#52c41a', display: 'flex', alignItems: 'center' }}>
                                                        <ArrowUpOutlined style={{ fontSize: '12px' }} />
                                                        {((trendData.alcohol[trendData.alcohol.length - 1] - trendData.alcohol[0]) / trendData.alcohol[0] * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
                                                    Алкогольных лицензий
                                                </div>
                                                {licenseStats.expiringAlcohol > 0 && (
                                                    <Tag color="orange" style={{ marginTop: '8px', borderRadius: '12px', fontSize: '12px' }}>
                                                        {licenseStats.expiringAlcohol} истекают
                                                    </Tag>
                                                )}
                                            </Card>
                                        </Col>

                                        {/* Tobacco Licenses Tile */}
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile"
                                                onClick={() => navigate('/references/tobacco')}
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
                                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#262626', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {licenseStats.activeTobacco}
                                                    <span style={{ fontSize: '14px', color: '#52c41a', display: 'flex', alignItems: 'center' }}>
                                                        <ArrowUpOutlined style={{ fontSize: '12px' }} />
                                                        {((trendData.tobacco[trendData.tobacco.length - 1] - trendData.tobacco[0]) / trendData.tobacco[0] * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
                                                    Табачных лицензий
                                                </div>
                                                {licenseStats.expiringTobacco > 0 && (
                                                    <Tag color="orange" style={{ marginTop: '8px', borderRadius: '12px', fontSize: '12px' }}>
                                                        {licenseStats.expiringTobacco} истекают
                                                    </Tag>
                                                )}
                                            </Card>
                                        </Col>

                                        {/* Regions Tile */}
                                        <Col xs={24} sm={12} md={8} lg={4}>
                                            <Card
                                                hoverable
                                                className="dashboard-tile"
                                                onClick={() => navigate('/regions')}
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
                                                    background: '#fff1f0',
                                                    width: '56px',
                                                    height: '56px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginBottom: '16px'
                                                }}>
                                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12 2L2 7V11C2 16.5 6 21.5 12 22C18 21.5 22 16.5 22 11V7L12 2Z" fill="#ff4d4f" fillOpacity="0.2" stroke="#ff4d4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                        <path d="M12 8V12L14 14" stroke="#ff4d4f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#262626', lineHeight: 1 }}>
                                                    85
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#8c8c8c', marginTop: '8px' }}>
                                                    Регионов РФ
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                ),
                            },
                        ]}
                    />
                </Col>
            </Row>

            {/* FIAS Modal */}
            < Modal
                title="Проверка адреса ФИАС"
                open={isFiasModalOpen}
                onCancel={handleCloseFiasModal}
                footer={null}
                width={700}
            >
                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                        Выберите магазин
                    </label>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Выберите магазин из справочника"
                        loading={loadingStores}
                        showSearch
                        optionFilterProp="children"
                        value={selectedStore?.id}
                        onChange={handleStoreSelect}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        options={stores.map(store => ({
                            value: store.id,
                            label: `${store.mvz} - ${store.name}`
                        }))}
                    />
                </div>

                {
                    selectedStore && (
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                                Адрес магазина
                            </label>
                            <Alert
                                message={selectedStore.address}
                                type="info"
                                showIcon
                                style={{
                                    fontSize: '14px',
                                    padding: '16px',
                                    backgroundColor: '#e6f7ff',
                                    border: '1px solid #91d5ff'
                                }}
                            />
                            <div style={{ marginTop: 12, fontSize: '13px', color: '#8c8c8c' }}>
                                <div><strong>МВЗ:</strong> {selectedStore.mvz}</div>
                                <div><strong>Название:</strong> {selectedStore.name}</div>
                            </div>
                        </div>
                    )
                }

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 24 }}>
                    <Button onClick={handleCloseFiasModal}>
                        Отмена
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleVerifyAddress}
                        disabled={!selectedStore}
                    >
                        Проверить
                    </Button>
                </div>
            </Modal >
        </div >
    );
};

export default Dashboard;
