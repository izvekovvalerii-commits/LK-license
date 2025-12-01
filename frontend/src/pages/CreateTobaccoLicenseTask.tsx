import React from 'react';
import ProcessTaskForm from '../components/ProcessTaskForm';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { LicenseType } from '../types';

const CreateTobaccoLicenseTask: React.FC = () => {
    return (
        <ProcessTaskForm
            title="Создание задачи на получение табачной лицензии"
            initialLicenseType={LicenseType.TOBACCO}
            fixedLicenseType={true}
            icon={<SafetyCertificateOutlined style={{ fontSize: '24px', color: '#faad14' }} />}
        />
    );
};

export default CreateTobaccoLicenseTask;
