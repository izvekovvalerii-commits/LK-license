import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export interface EgrnExtract {
    id?: number;
    applicantType: string;
    phone: string;
    email: string;
    cadastralNumber: string;
    objectType: string;
    mvz: string;
    status: 'DRAFT' | 'SUBMITTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
    createdAt?: string;
}

export const egrnService = {
    getAll: async (): Promise<EgrnExtract[]> => {
        const response = await axios.get(`${API_URL}/egrn-extracts`);
        return response.data;
    },

    create: async (extract: EgrnExtract): Promise<EgrnExtract> => {
        const response = await axios.post(`${API_URL}/egrn-extracts`, extract);
        return response.data;
    },

    getById: async (id: string): Promise<EgrnExtract> => {
        const response = await axios.get(`${API_URL}/egrn-extracts/${id}`);
        return response.data;
    }
};
