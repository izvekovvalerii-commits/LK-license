import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Avatar } from 'antd';
import Logo from './Logo';
import {
    DashboardOutlined,
    FileTextOutlined,
    DollarOutlined,
    BookOutlined,
    UserOutlined,
    EnvironmentOutlined,
    HomeOutlined,
    LogoutOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const { Sider, Content } = AntLayout;

interface LayoutProps {
    children: React.ReactNode;
    onSettingsClick?: () => void;
}

const MainLayout: React.FC<LayoutProps> = ({ children, onSettingsClick }) => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const menuItems = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: <Link to="/">Главная</Link>,
        },
        {
            key: '/tasks',
            icon: <FileTextOutlined />,
            label: <Link to="/tasks">Задачи</Link>,
        },

        {
            key: '/payments',
            icon: <DollarOutlined />,
            label: <Link to="/payments">Платежи</Link>,
        },
        {
            key: '/documents/egrn-list',
            icon: <FileTextOutlined />,
            label: <Link to="/documents/egrn-list">Выписки ЕГРН</Link>,
        },
        {
            key: '/documents/gis',
            icon: <EnvironmentOutlined />,
            label: <Link to="/documents/gis">Анализ локации</Link>,
        },
        {
            key: '/documents/lease',
            icon: <HomeOutlined />,
            label: <Link to="/documents/lease">Договоры аренды</Link>,
        },
        {
            key: '/references',
            icon: <BookOutlined />,
            label: 'Справочники',
            children: [
                {
                    key: '/stores',
                    label: <Link to="/stores">Магазины</Link>,
                },
                {
                    key: '/regions',
                    label: <Link to="/regions">Регионы РФ</Link>,
                },
                {
                    key: '/references/alcohol',
                    label: <Link to="/references/alcohol">Алкогольные лицензии</Link>,
                },
                {
                    key: '/references/tobacco',
                    label: <Link to="/references/tobacco">Табачные лицензии</Link>,
                },
            ],
        },
    ];

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="dark"
                width={260}
                style={{
                    overflow: 'hidden',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    zIndex: 1000,
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)' }}>
                    <Logo collapsed={collapsed} />

                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0' }}
                        className="custom-sidebar-menu"
                    />

                    {/* User Profile Section */}
                    {/* User Profile Section */}
                    <div style={{
                        padding: '16px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        flexDirection: collapsed ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: collapsed ? 'center' : 'space-between',
                        gap: '12px',
                        background: '#001529'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? '16px' : '12px', flexDirection: collapsed ? 'column' : 'row', width: '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden', flex: 1 }}>
                                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', flexShrink: 0, cursor: 'pointer' }} />
                                {!collapsed && (
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{ color: '#fff', fontWeight: 500, fontSize: '14px', lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Администратор</span>
                                        <span style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>admin@x5.ru</span>
                                    </div>
                                )}
                            </div>

                            {!collapsed && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <SettingOutlined
                                        style={{ color: 'rgba(255, 255, 255, 0.65)', cursor: 'pointer', fontSize: '16px' }}
                                        onClick={onSettingsClick}
                                    />
                                    <LogoutOutlined style={{ color: 'rgba(255, 255, 255, 0.65)', cursor: 'pointer', fontSize: '16px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Sider>
            <AntLayout style={{ marginLeft: collapsed ? 80 : 260, transition: 'margin-left 0.2s' }}>
                <Content className="site-layout-content">
                    {children}
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default MainLayout;
