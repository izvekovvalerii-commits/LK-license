
import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Space, Avatar, Badge } from 'antd';
import Logo from './Logo';
import {
    DashboardOutlined,
    FileTextOutlined,
    FolderOutlined,
    DollarOutlined,
    BookOutlined,
    BellOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;

interface LayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
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
                        <div className="header-title">
                            <SafetyCertificateOutlined style={{ marginRight: 8, fontSize: '20px' }} />
                            Портал управления лицензиями
                        </div>
                        <Space size="large">
                            <Badge count={0} showZero>
                                <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                            </Badge>
                            <Space style={{ cursor: 'pointer' }}>
                                <Avatar icon={<UserOutlined />} />
                                <span>Администратор</span>
                            </Space>
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
