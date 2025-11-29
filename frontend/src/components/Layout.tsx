
import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Dropdown, Space, Avatar, Button, Badge } from 'antd';
import Logo from './Logo';
import {
    DashboardOutlined,
    FileTextOutlined,
    FolderOutlined,
    DollarOutlined,
    BookOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    ShopOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const user = authService.getStoredUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Профиль',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Настройки',
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Выход',
            onClick: handleLogout,
        },
    ];

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
            key: '/documents',
            icon: <FolderOutlined />,
            label: <Link to="/documents">Документы</Link>,
        },
        {
            key: '/payments',
            icon: <DollarOutlined />,
            label: <Link to="/payments">Платежи</Link>,
        },
        {
            key: '/stores',
            icon: <ShopOutlined />,
            label: <Link to="/stores">Магазины</Link>,
        },
        {
            key: '/references',
            icon: <BookOutlined />,
            label: 'Справочники',
            children: [
                {
                    key: '/references/alcohol',
                    label: <Link to="/references/alcohol">Алкогольные лицензии</Link>,
                },
                {
                    key: '/references/tobacco',
                    label: <Link to="/references/tobacco">Табачные лицензии</Link>,
                },
                {
                    key: '/references/employees',
                    label: <Link to="/references/employees">Сотрудники</Link>,
                },
            ],
        },
    ];

    return (
        <AntLayout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} theme="dark">
                <Logo collapsed={collapsed} />
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                />
            </Sider>
            <AntLayout>
                <Header className="site-layout-header">
                    <div className="header-content">
                        <div className="header-title">Система управления лицензиями</div>
                        <Space size="large">
                            <Badge count={0} showZero>
                                <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                            </Badge>
                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                                <Space style={{ cursor: 'pointer' }}>
                                    <Avatar icon={<UserOutlined />} />
                                    <span>{user?.fullName || user?.username}</span>
                                </Space>
                            </Dropdown>
                        </Space>
                    </div>
                </Header>
                <Content className="site-layout-content">
                    {children}
                </Content>
            </AntLayout>
        </AntLayout>
    );
};

export default MainLayout;
