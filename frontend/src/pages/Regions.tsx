import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Space, Card, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { regionService } from '../services/regionService';
import type { Region } from '../types';
import './Stores.css';

const Regions: React.FC = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        loadRegions();
    }, []);

    const loadRegions = async () => {
        setLoading(true);
        try {
            const data = await regionService.getAllRegions();
            setRegions(data);
        } catch (error) {
            message.error('Ошибка загрузки регионов');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingRegion(null);
        form.resetFields();
        setModalVisible(true);
    };





    const handleSubmit = async (values: any) => {
        try {
            if (editingRegion) {
                await regionService.updateRegion(editingRegion.id, values);
                message.success('Регион обновлен');
            } else {
                await regionService.createRegion(values);
                message.success('Регион создан');
            }
            setModalVisible(false);
            loadRegions();
        } catch (error) {
            message.error('Ошибка сохранения региона');
        }
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'regionCode',
            key: 'regionCode',
            width: 70,
            fixed: 'left' as const,
            sorter: (a: Region, b: Region) => {
                const codeA = parseInt(a.regionCode || '0');
                const codeB = parseInt(b.regionCode || '0');
                return codeA - codeB;
            },
        },
        {
            title: 'Наименование Субъекта РФ',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            render: (text: string) => (
                <Space>
                    <EnvironmentOutlined style={{ color: '#1890ff' }} />
                    <strong>{text}</strong>
                </Space>
            ),
            sorter: (a: Region, b: Region) => a.name.localeCompare(b.name),
        },
        {
            title: 'Тип лицензии',
            dataIndex: 'licenseType',
            key: 'licenseType',
            width: 180,
            render: (type: string) => (
                <Tag color="blue">{type || '-'}</Tag>
            ),
        },
        {
            title: 'ГИИД Региона',
            dataIndex: 'regionGiid',
            key: 'regionGiid',
            width: 300,
            ellipsis: true,
        },
        {
            title: 'Код контрагента',
            dataIndex: 'counterpartyCode',
            key: 'counterpartyCode',
            width: 150,
            render: (text: string) => text || '-',
        },
        {
            title: 'ИНН',
            dataIndex: 'counterpartyInn',
            key: 'counterpartyInn',
            width: 150,
            render: (text: string) => text || '-',
        },
        {
            title: 'КПП',
            dataIndex: 'kpp',
            key: 'kpp',
            width: 120,
            render: (text: string) => text || '-',
        },
        {
            title: 'Расчетный БИК',
            dataIndex: 'settlementBik',
            key: 'settlementBik',
            width: 150,
            render: (text: string) => text || '-',
        },

    ];

    return (
        <div className="stores-container">
            <Card>
                <div className="stores-header">
                    <h1>
                        <EnvironmentOutlined /> Справочник регионов РФ
                    </h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                    >
                        Добавить регион
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={regions}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Всего регионов: ${total}`,
                    }}
                    scroll={{ x: 1500 }}
                />
            </Card>

            <Modal
                title={editingRegion ? 'Редактировать регион' : 'Добавить регион'}
                open={modalVisible}
                onCancel={() => setModalVisible(false)}
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
                        label="Наименование Субъекта РФ"
                        rules={[{ required: true, message: 'Введите наименование региона' }]}
                    >
                        <Input placeholder="Например: Республика Башкортостан" />
                    </Form.Item>

                    <Form.Item
                        name="regionCode"
                        label="Код региона"
                        rules={[
                            { required: true, message: 'Введите код региона' },
                            { pattern: /^\d{1,2}$/, message: 'Код должен содержать 1-2 цифры' }
                        ]}
                    >
                        <Input placeholder="02" maxLength={2} />
                    </Form.Item>

                    <Form.Item
                        name="licenseType"
                        label="Тип лицензии"
                    >
                        <Input placeholder="Табачная продукция" />
                    </Form.Item>

                    <Form.Item
                        name="regionGiid"
                        label="ГИИД Региона"
                    >
                        <Input placeholder="6f2cbf36-692a-4ee4-9b1d-06f271bbde3fc" />
                    </Form.Item>

                    <Form.Item
                        name="counterpartyCode"
                        label="Код контрагента"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="counterpartyInn"
                        label="ИНН контрагента"
                        rules={[
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
                        name="settlementBik"
                        label="Расчетный БИК"
                        rules={[
                            { pattern: /^\d{9}$/, message: 'БИК должен содержать 9 цифр' }
                        ]}
                    >
                        <Input placeholder="044525225" maxLength={9} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Regions;
