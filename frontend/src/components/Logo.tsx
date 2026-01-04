import React from 'react';
import { Space, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
    collapsed: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed }) => {
    const navigate = useNavigate();
    const { currentTheme, toggleTheme } = useTheme();

    const handleLogoClick = () => {
        navigate('/');
    };

    return (
        <div
            className="logo-container"
            onClick={handleLogoClick}
            style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: collapsed ? '0' : '0 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                transition: 'all 0.2s',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
            }}
        >
            <Space size={12} align="center" style={{ justifyContent: collapsed ? 'center' : 'flex-start', width: '100%', paddingLeft: collapsed ? 0 : '8px' }}>
                {/* SVG Icon - Shield with Checkmark */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3L4 8V14C4 21.5 9.5 28.5 16 30C22.5 28.5 28 21.5 28 14V8L16 3Z" fill="#1890ff" fillOpacity="0.2" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 16L14.5 19.5L21 13" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                        <span style={{
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '20px',
                            letterSpacing: '-0.5px'
                        }}>
                            X5
                        </span>
                        <span style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: 500,
                            fontSize: '20px',
                            marginLeft: '6px'
                        }}>
                            LICENSE
                        </span>
                    </div>
                )}
            </Space>
            {!collapsed && (
                <div style={{ position: 'absolute', right: 16 }} onClick={(e) => e.stopPropagation()}>
                    <Switch
                        size="small"
                        checked={currentTheme === 'dark'}
                        onChange={toggleTheme}
                        checkedChildren={<BulbFilled />}
                        unCheckedChildren={<BulbOutlined />}
                        style={{ backgroundColor: currentTheme === 'dark' ? '#1890ff' : '#bfbfbf' }}
                    />
                </div>
            )}
        </div>
    );
};

export default Logo;
