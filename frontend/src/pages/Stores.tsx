import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { storeService } from '../services/storeService';
import type { Store } from '../types';
import './Stores.css';

const Stores: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            setLoading(true);
            const data = await storeService.getAllStores();
            setStores(data);
        } catch (error) {
            message.error('Ошибка загрузки магазинов');
            console.error('Error loading stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingStore(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (store: Store) => {
        setEditingStore(store);
        form.setFieldsValue(store);
        setIsModalVisible(true);
    };

    const handleDelete = (id: number) => {
        Modal.confirm({
            title: 'Удалить магазин?',
            content: 'Это действие нельзя отменить',
            okText: 'Удалить',
            okType: 'danger',
            cancelText: 'Отмена',
            onOk: async () => {
                try {
                    // await storeService.deleteStore(id);
                    message.success('Магазин удален');
                    loadStores();
                } catch (error) {
                    message.error('Ошибка удаления магазина');
                }
            },
        });
    };

    const handleSubmit = async (values: any) => {
        try {
            if (editingStore) {
                // await storeService.updateStore(editingStore.id, values);
                message.success('Магазин обновлен');
            } else {
                // await storeService.createStore(values);
                message.success('Магазин создан');
            }
            setIsModalVisible(false);
            loadStores();
        } catch (error) {
            message.error('Ошибка сохранения магазина');
        }
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'id',
            key: 'id',
            width: 60,
            fixed: 'left' as const,
        },
        {
            title: 'МВЗ',
            dataIndex: 'mvz',
            key: 'mvz',
            width: 100,
            fixed: 'left' as const,
        },
        {
            title: 'Название',
            dataIndex: 'name',
            key: 'name',
            width: 200,
            render: (text: string) => (
                <Space>
                    <ShopOutlined />
                    <strong>{text}</strong>
                </Space>
            ),
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            width: 300,
        },
        {
            title: 'ЦФО',
            dataIndex: 'cfo',
            key: 'cfo',
            width: 100,
        },
        {
            title: 'ОКТМО',
            dataIndex: 'oktmo',
            key: 'oktmo',
            width: 100,
        },
        {
            title: 'Есть запрет',
            dataIndex: 'hasRestriction',
            key: 'hasRestriction',
            width: 100,
            render: (hasRestriction: boolean) => (
                <Tag color={hasRestriction ? 'red' : 'green'}>
                    {hasRestriction ? 'Да' : 'Нет'}
                </Tag>
            ),
        },
        {
            title: 'Мун. область',
            dataIndex: 'munArea',
            key: 'munArea',
            width: 150,
        },
        {
            title: 'Мун. район',
            dataIndex: 'munDistrict',
            key: 'munDistrict',
            width: 150,
        },
        {
            title: 'БЕ',
            dataIndex: 'be',
            key: 'be',
            width: 200,
        },
        {
            title: 'Дата закрытия',
            dataIndex: 'closeDate',
            key: 'closeDate',
            width: 120,
            render: (date: string) => date || '-',
        },
        {
            title: 'Лицензии',
            key: 'licenses',
            width: 200,
            render: (_: any, record: Store) => (
                <Space direction="vertical" size="small">
                    {record.alcoholLicenseExpiry && (
                        <Tag color="blue">
                            Алкоголь: {new Date(record.alcoholLicenseExpiry).toLocaleDateString('ru-RU')}
                        </Tag>
                    )}
                    {record.tobaccoLicenseExpiry && (
                        <Tag color="orange">
                            Табак: {new Date(record.tobaccoLicenseExpiry).toLocaleDateString('ru-RU')}
                        </Tag>
                    )}
                </Space>
            ),
        },
        {
            title: 'Статус',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            fixed: 'right' as const,
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Активен' : 'Неактивен'}
                </Tag>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 120,
            fixed: 'right' as const,
            render: (_: any, record: Store) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="link"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="stores-container">
            <Card>
                <div className="stores-header">
                    <h1>
                        <ShopOutlined /> Справочник магазинов
                    </h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Добавить магазин
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={stores}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Всего магазинов: ${total}`,
                    }}
                    scroll={{ x: 1500 }}
                />
            </Card>

            <Modal
                title={editingStore ? 'Редактировать магазин' : 'Добавить магазин'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                width={800}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="name"
                        label="Название магазина"
                        rules={[{ required: true, message: 'Введите название' }]}
                    >
                        <Input placeholder="Например: Пятёрочка №123" />
                    </Form.Item>

                    <Form.Item
                        name="inn"
                        label="ИНН"
                        rules={[
                            { required: true, message: 'Введите ИНН' },
                            { pattern: /^\d{10}$|^\d{12}$/, message: 'ИНН должен содержать 10 или 12 цифр' }
                        ]}
                    >
                        <Input placeholder="7701234567" maxLength={12} />
                    </Form.Item>

                    <Form.Item
                        name="kpp"
                        label="КПП"
                        rules={[
                            { pattern: /^\d{9}$/, message: 'КПП должен содержать 9 цифр' }
                        ]}
                    >
                        <Input placeholder="770101001" maxLength={9} />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Адрес"
                        rules={[{ required: true, message: 'Введите адрес' }]}
                    >
                        <Input.TextArea rows={2} placeholder="г. Москва, ул. Ленина, д. 10" />
                    </Form.Item>

                    <Form.Item
                        name="contactPerson"
                        label="Контактное лицо"
                    >
                        <Input placeholder="Иванов Иван Иванович" />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Телефон"
                        rules={[
                            { pattern: /^[+]?[0-9\s()-]{7,20}$/, message: 'Неверный формат телефона' }
                        ]}
                    >
                        <Input placeholder="+7 (999) 123-45-67" />
                    </Form.Item>

                    <Form.Item
                        name="directorPhone"
                        label="Телефон директора"
                    >
                        <Input placeholder="+7 (999) 123-45-67" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { type: 'email', message: 'Неверный формат email' }
                        ]}
                    >
                        <Input placeholder="store@example.com" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Stores;
