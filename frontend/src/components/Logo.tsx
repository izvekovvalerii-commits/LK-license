import React from 'react';
import { Space } from 'antd';

interface LogoProps {
    collapsed: boolean;
}

const Logo: React.FC<LogoProps> = ({ collapsed }) => {
    return (
        <div className="logo-container" style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: collapsed ? '0' : '0 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            transition: 'all 0.2s',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
        }}>
            <Space size={12} align="center" style={{ justifyContent: 'center', width: '100%' }}>
                {/* SVG Icon - Shield with Checkmark */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 3L4 8V14C4 21.5 9.5 28.5 16 30C22.5 28.5 28 21.5 28 14V8L16 3Z" fill="#1890ff" fillOpacity="0.2" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 16L14.5 19.5L21 13" stroke="#1890ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {!collapsed && (
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '16px',
                            letterSpacing: '0.5px'
                        }}>
                            LICENSE
                        </span>
                        <span style={{
                            color: 'rgba(255,255,255,0.65)',
                            fontSize: '11px',
                            fontWeight: 500,
                            textTransform: 'uppercase'
                        }}>
                            PORTAL
                        </span>
                    </div>
                )}
            </Space>
        </div>
    );
};

export default Logo;
