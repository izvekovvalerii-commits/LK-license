import api from './api';
import type { Store } from '../types';

export const storeService = {
    async getAllStores(): Promise<Store[]> {
        const response = await api.get<Store[]>('/references/stores');
        return response.data;
    },

    async getStoreById(id: number): Promise<Store> {
        const response = await api.get<Store>(`/references/stores/${id}`);
        return response.data;
    },

    async createStore(store: Partial<Store>): Promise<Store> {
        const response = await api.post<Store>('/references/stores', store);
        return response.data;
    },

    async updateStore(id: number, store: Partial<Store>): Promise<Store> {
        const response = await api.put<Store>(`/references/stores/${id}`, store);
        return response.data;
    },

    async deleteStore(id: number): Promise<void> {
        await api.delete(`/references/stores/${id}`);
    },
};
