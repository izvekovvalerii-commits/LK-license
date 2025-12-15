import React from 'react';
import ProcessTaskForm from '../components/ProcessTaskForm';
import { SafetyCertificateOutlined } from '@ant-design/icons';
import { LicenseType } from '../types';

const CreateAlcoholLicenseTask: React.FC = () => {
    return (
        <ProcessTaskForm
            title="Создание задачи на получение алкогольной лицензии"
            initialLicenseType={LicenseType.ALCOHOL}
            fixedLicenseType={true}
            icon={<SafetyCertificateOutlined style={{ fontSize: '24px', color: '#52c41a' }} />}
        />
    );
};

export default CreateAlcoholLicenseTask;
