import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Typography, Space, message, Modal, Input } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { storeService } from '../services/storeService';
import type { Store } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

const GisAnalysis: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

    const [mapUrl, setMapUrl] = useState<string | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [decisionText, setDecisionText] = useState('');

    useEffect(() => {
        loadStores();
    }, []);

    const loadStores = async () => {
        try {
            const data = await storeService.getAllStores();
            setStores(data);
        } catch (error) {
            console.error('Failed to load stores:', error);
            message.error('Не удалось загрузить список магазинов');
        }
    };

    const handleEvaluate = () => {
        if (!selectedStoreId) return;

        const selectedStore = stores.find(s => s.id === selectedStoreId);
        if (selectedStore && selectedStore.address) {
            const encodedAddress = encodeURIComponent(selectedStore.address);
            // Use map-widget/v1 for embedding
            setMapUrl(`https://yandex.ru/map-widget/v1/?text=${encodedAddress}&z=17`);
        } else {
            message.warning('У выбранного магазина не указан адрес');
        }
    };

    const handleDecision = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = () => {
        if (!decisionText.trim()) {
            message.warning('Введите текст заключения');
            return;
        }
        message.success('Заключение сохранено');
        setIsModalVisible(false);
        setDecisionText('');
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Card style={{ maxWidth: 1000, margin: '0 auto', borderRadius: 8 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        background: '#f9f0ff',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <EnvironmentOutlined style={{ fontSize: '40px', color: '#722ed1' }} />
                    </div>
                    <Title level={3}>Анализ локации в ГИС</Title>
                    <Text type="secondary">Выберите магазин для оценки его локации на карте</Text>
                </div>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <div style={{ marginBottom: 8, fontWeight: 500 }}>Выберите магазин:</div>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Выберите магазин из списка"
                            optionFilterProp="children"
                            onChange={(value) => {
                                setSelectedStoreId(value);
                                setMapUrl(null); // Reset map when store changes
                            }}
                            filterOption={(input, option) =>
                                (option?.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {stores.map(store => (
                                <Option key={store.id} value={store.id}>
                                    {store.name} ({store.address})
                                </Option>
                            ))}
                        </Select>
                    </div>

                    <Space size="middle" style={{ width: '100%' }}>
                        <Button
                            type="primary"
                            icon={<EnvironmentOutlined />}
                            onClick={handleEvaluate}
                            disabled={!selectedStoreId}
                            style={{
                                height: '40px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                padding: '0 24px'
                            }}
                        >
                            Оценить локацию
                        </Button>
                        <Button
                            onClick={handleDecision}
                            disabled={!selectedStoreId}
                            style={{
                                height: '40px',
                                fontSize: '14px',
                                borderRadius: '6px',
                                padding: '0 24px'
                            }}
                        >
                            Принять решение
                        </Button>
                    </Space>

                    {mapUrl && (
                        <div style={{ marginTop: 24, height: '500px', width: '100%', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                            <iframe
                                src={mapUrl}
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                allowFullScreen={true}
                                style={{ display: 'block' }}
                            />
                        </div>
                    )}
                </Space>
            </Card>

            <Modal
                title="Принятие решения"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Сохранить"
                cancelText="Отмена"
            >
                <div style={{ marginBottom: 16 }}>
                    <Text strong>Заключение по локации:</Text>
                </div>
                <Input.TextArea
                    rows={4}
                    value={decisionText}
                    onChange={(e) => setDecisionText(e.target.value)}
                    placeholder="Введите ваше заключение здесь..."
                />
            </Modal>
        </div>
    );
};

export default GisAnalysis;
