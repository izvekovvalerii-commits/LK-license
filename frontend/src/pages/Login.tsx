import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import type { LoginRequest } from '../types';
import './Login.css';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        try {
            await authService.login(values);
            message.success('Вход выполнен успешно!');
            navigate('/');
        } catch (error: any) {
            console.error('Login error:', error);
            message.error(`Ошибка: ${error.response?.status} - ${error.message} - ${JSON.stringify(error.response?.data)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <Card className="login-card" title="Портал Лицензирования">
                <div className="login-subtitle">Личный кабинет сотрудника</div>
                <Form
                    name="login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Введите имя пользователя!' }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Имя пользователя"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Введите пароль!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Пароль"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-button"
                            size="large"
                            loading={loading}
                            block
                        >
                            Войти
                        </Button>
                    </Form.Item>
                </Form>

                <div className="login-demo-info">
                    <p><strong>Демо доступ:</strong></p>
                    <p>Администратор: admin / admin123</p>
                    <p>Менеджер: manager / manager123</p>
                </div>
            </Card>
        </div>
    );
};

export default Login;
