import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Typography, Space, message, Modal, Input, Spin } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { storeService } from '../services/storeService';
import type { Store } from '../types';
import 'leaflet/dist/leaflet.css';

const { Title, Text } = Typography;
const { Option } = Select;

// Fix for default marker icons in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons
const storeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const schoolIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const kindergartenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface POI {
    id: string;
    lat: number;
    lon: number;
    name: string;
    type: 'school' | 'kindergarten';
}

// Component to update map view
const MapUpdater: React.FC<{ center: [number, number], zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const GisAnalysis: React.FC = () => {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
    const [isMapLoading, setIsMapLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [decisionText, setDecisionText] = useState('');

    const [mapCenter, setMapCenter] = useState<[number, number]>([55.751244, 37.618423]); // Moscow default
    const [storeCoords, setStoreCoords] = useState<[number, number] | null>(null);
    const [pois, setPois] = useState<POI[]>([]);
    const [showMap, setShowMap] = useState(false);

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

    // Geocode address using Nominatim with multiple strategies
    const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
        try {
            // Strategy 1: Search as-is
            let response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=ru`
            );
            let data = await response.json();

            if (data && data.length > 0) {
                console.log('Geocoding successful (strategy 1):', data[0]);
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }

            // Strategy 2: Try with "Россия" prefix
            response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent('Россия, ' + address)}&limit=1`
            );
            data = await response.json();

            if (data && data.length > 0) {
                console.log('Geocoding successful (strategy 2):', data[0]);
                return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            }

            // Strategy 3: Extract city and street
            const cityMatch = address.match(/г\.\s*([^,]+)/);
            const streetMatch = address.match(/ул\.\s*([^,]+)/);

            if (cityMatch && streetMatch) {
                const simplifiedAddress = `${cityMatch[1]}, ${streetMatch[1]}, Россия`;
                response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simplifiedAddress)}&limit=1`
                );
                data = await response.json();

                if (data && data.length > 0) {
                    console.log('Geocoding successful (strategy 3):', data[0]);
                    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                }
            }

            // Strategy 4: Just search for city as fallback
            if (cityMatch) {
                response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityMatch[1] + ', Россия')}&limit=1`
                );
                data = await response.json();

                if (data && data.length > 0) {
                    console.log('Geocoding successful (strategy 4 - city center):', data[0]);
                    message.warning('Точный адрес не найден, показан центр города');
                    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                }
            }

            console.error('All geocoding strategies failed for address:', address);
            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    // Search for POIs using Overpass API
    const searchPOIs = async (lat: number, lon: number, radius: number = 1000) => {
        try {
            const query = `
                [out:json][timeout:25];
                (
                  node["amenity"="school"](around:${radius},${lat},${lon});
                  way["amenity"="school"](around:${radius},${lat},${lon});
                  node["amenity"="kindergarten"](around:${radius},${lat},${lon});
                  way["amenity"="kindergarten"](around:${radius},${lat},${lon});
                );
                out center;
            `;

            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                body: query
            });

            const data = await response.json();
            const foundPOIs: POI[] = [];

            data.elements.forEach((element: any) => {
                const poiLat = element.lat || element.center?.lat;
                const poiLon = element.lon || element.center?.lon;

                if (poiLat && poiLon) {
                    const type = element.tags?.amenity === 'school' ? 'school' : 'kindergarten';
                    const name = element.tags?.name || (type === 'school' ? 'Школа' : 'Детский сад');

                    foundPOIs.push({
                        id: element.id.toString(),
                        lat: poiLat,
                        lon: poiLon,
                        name: name,
                        type: type
                    });
                }
            });

            return foundPOIs;
        } catch (error) {
            console.error('POI search error:', error);
            return [];
        }
    };

    const handleEvaluate = async () => {
        if (!selectedStoreId) return;

        const selectedStore = stores.find(s => s.id === selectedStoreId);
        if (!selectedStore || !selectedStore.address) {
            message.warning('У выбранного магазина не указан адрес');
            return;
        }

        setIsMapLoading(true);
        setPois([]);

        // Geocode the address
        const coords = await geocodeAddress(selectedStore.address);

        if (!coords) {
            message.error('Не удалось найти адрес на карте');
            setIsMapLoading(false);
            return;
        }

        setMapCenter(coords);
        setStoreCoords(coords);
        setShowMap(true);

        // Search for POIs
        const foundPOIs = await searchPOIs(coords[0], coords[1], 1000);
        setPois(foundPOIs);

        message.success(`Найдено: ${foundPOIs.filter(p => p.type === 'school').length} школ(ы), ${foundPOIs.filter(p => p.type === 'kindergarten').length} детских садов`);
        setIsMapLoading(false);
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
            <Card style={{ maxWidth: 1200, margin: '0 auto', borderRadius: 8 }}>
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
                    <div style={{ marginTop: 12 }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            <span style={{ color: '#f5222d' }}>●</span> Магазин &nbsp;
                            <span style={{ color: '#1890ff' }}>●</span> Школы &nbsp;
                            <span style={{ color: '#52c41a' }}>●</span> Детские сады
                        </Text>
                    </div>
                </div>

                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <div style={{ marginBottom: 8, fontWeight: 500 }}>Выберите магазин:</div>
                        <Select
                            showSearch
                            style={{ width: '100%' }}
                            placeholder="Выберите магазин из списка"
                            optionFilterProp="children"
                            value={selectedStoreId}
                            onChange={(value) => {
                                setSelectedStoreId(value);
                                setShowMap(false);
                                setPois([]);
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
                            loading={isMapLoading}
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

                    {isMapLoading && (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" />
                            <div style={{ marginTop: 16, color: '#8c8c8c' }}>Загрузка карты и поиск объектов...</div>
                        </div>
                    )}

                    {showMap && storeCoords && !isMapLoading && (
                        <div style={{
                            marginTop: 24,
                            height: '500px',
                            width: '100%',
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <MapContainer
                                center={mapCenter}
                                zoom={15}
                                style={{ height: '100%', width: '100%' }}
                                scrollWheelZoom={true}
                                attributionControl={false}
                            >
                                <TileLayer
                                    attribution=''
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapUpdater center={mapCenter} zoom={15} />

                                {/* Store marker */}
                                <Marker position={storeCoords} icon={storeIcon}>
                                    <Popup>
                                        <strong>Магазин</strong><br />
                                        {stores.find(s => s.id === selectedStoreId)?.address}
                                    </Popup>
                                </Marker>

                                {/* 1000m radius circle */}
                                <Circle
                                    center={storeCoords}
                                    radius={1000}
                                    pathOptions={{
                                        fillColor: '#1890ff',
                                        fillOpacity: 0.1,
                                        color: '#1890ff',
                                        weight: 2
                                    }}
                                />

                                {/* POI markers */}
                                {pois.map(poi => (
                                    <Marker
                                        key={poi.id}
                                        position={[poi.lat, poi.lon]}
                                        icon={poi.type === 'school' ? schoolIcon : kindergartenIcon}
                                    >
                                        <Popup>
                                            <strong>{poi.type === 'school' ? 'Школа' : 'Детский сад'}</strong><br />
                                            {poi.name}
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
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
