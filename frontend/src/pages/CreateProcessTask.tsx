import React from 'react';
import ProcessTaskForm from '../components/ProcessTaskForm';
import { ApartmentOutlined } from '@ant-design/icons';

const CreateProcessTask: React.FC = () => {
    return (
        <ProcessTaskForm
            title="Создание задачи по процессу"
            icon={<ApartmentOutlined style={{ fontSize: '24px', color: '#cf1322' }} />}
        />
    );
};

export default CreateProcessTask;
