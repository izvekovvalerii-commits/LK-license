import React, { useState } from 'react';
import { Form, Input, Button, Upload, Card, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { TextArea } = Input;

const SendLicenseEmail: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);

    const onFinish = async (values: any) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('to', values.to);
        formData.append('subject', values.subject);
        formData.append('text', values.text);

        fileList.forEach(file => {
            formData.append('files', file.originFileObj);
        });

        try {
            await api.post('/email/send-multipart', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            message.success('Письмо успешно отправлено');
            navigate('/tasks');
        } catch (error) {
            message.error('Ошибка отправки письма');
        } finally {
            setLoading(false);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ marginBottom: 16 }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/tasks')}>
                    Назад
                </Button>
            </div>
            <Card title="Отправка данных в орган лицензирования">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        to: 'license@authority.gov.ru',
                        subject: 'Предоставление документов по лицензии'
                    }}
                >
                    <Form.Item
                        name="to"
                        label="Кому"
                        rules={[{ required: true, message: 'Введите email получателя' }, { type: 'email', message: 'Некорректный email' }]}
                    >
                        <Input placeholder="email@example.com" />
                    </Form.Item>

                    <Form.Item
                        name="subject"
                        label="Тема"
                        rules={[{ required: true, message: 'Введите тему письма' }]}
                    >
                        <Input placeholder="Тема письма" />
                    </Form.Item>

                    <Form.Item
                        name="text"
                        label="Текст письма"
                        rules={[{ required: true, message: 'Введите текст письма' }]}
                    >
                        <TextArea rows={6} placeholder="Введите текст сообщения..." />
                    </Form.Item>

                    <Form.Item
                        name="files"
                        label="Вложения"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            beforeUpload={() => false}
                            onChange={({ fileList }) => setFileList(fileList)}
                            multiple
                        >
                            <Button icon={<UploadOutlined />}>Выберите файлы</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SendOutlined />} loading={loading} block>
                            Отправить
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default SendLicenseEmail;
