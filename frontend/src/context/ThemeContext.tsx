import React, { createContext, useContext, useState, useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    currentTheme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as Theme) || 'light';
    });

    useEffect(() => {
        localStorage.setItem('theme', currentTheme);
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

    const toggleTheme = () => {
        setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            <ConfigProvider
                theme={{
                    algorithm: currentTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 8,
                        ...(currentTheme === 'dark' && {
                            colorBgBase: '#0a0e27',
                            colorBgContainer: '#141b2d',
                            colorBgElevated: '#1f2937',
                            colorBgLayout: '#0a0e27',
                            colorBorder: '#2d3748',
                            colorBorderSecondary: '#1f2937',
                            colorText: '#e2e8f0',
                            colorTextSecondary: '#94a3b8',
                            colorTextTertiary: '#64748b',
                            colorTextQuaternary: '#475569',
                            colorFill: '#1f2937',
                            colorFillSecondary: '#374151',
                            colorFillTertiary: '#4b5563',
                            colorFillQuaternary: '#6b7280',
                            colorBgSpotlight: '#1f2937',
                            colorPrimaryBg: '#1e3a8a',
                            colorPrimaryBgHover: '#1e40af',
                            colorPrimaryBorder: '#3b82f6',
                            colorPrimaryBorderHover: '#60a5fa',
                            colorPrimaryHover: '#60a5fa',
                            colorPrimaryActive: '#2563eb',
                            colorPrimaryTextHover: '#93c5fd',
                            colorPrimaryText: '#60a5fa',
                            colorPrimaryTextActive: '#3b82f6',
                        }),
                    },
                    components: {
                        Layout: {
                            ...(currentTheme === 'dark' && {
                                colorBgHeader: '#0a0e27',
                                colorBgBody: '#0a0e27',
                                colorBgTrigger: '#1f2937',
                            }),
                        },
                        Card: {
                            ...(currentTheme === 'dark' && {
                                colorBgContainer: '#141b2d',
                                colorBorderSecondary: '#2d3748',
                            }),
                        },
                        Menu: {
                            ...(currentTheme === 'dark' && {
                                colorItemBg: 'transparent',
                                colorItemBgHover: '#1f2937',
                                colorItemBgSelected: '#1e3a8a',
                                colorItemBgActive: '#1e40af',
                                colorItemText: '#e2e8f0',
                                colorItemTextHover: '#ffffff',
                                colorItemTextSelected: '#60a5fa',
                                colorSubItemBg: '#0a0e27',
                            }),
                        },
                        Table: {
                            ...(currentTheme === 'dark' && {
                                colorBgContainer: '#141b2d',
                                colorFillAlter: '#1f2937',
                            }),
                        },
                        Collapse: {
                            ...(currentTheme === 'dark' && {
                                colorBorder: '#2d3748',
                                colorFillAlter: '#141b2d',
                            }),
                        },
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
