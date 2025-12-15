import api from './api';
import type { User } from '../types';

export const userService = {
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },
};
