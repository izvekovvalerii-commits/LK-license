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

    async getLicenseStats(): Promise<{
        totalStores: number;
        activeAlcohol: number;
        expiringAlcohol: number;
        activeTobacco: number;
        expiringTobacco: number;
    }> {
        const stores = await this.getAllStores();
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        const today = new Date();

        const stats = {
            totalStores: stores.filter(s => s.isActive).length,
            activeAlcohol: 0,
            expiringAlcohol: 0,
            activeTobacco: 0,
            expiringTobacco: 0,
        };

        stores.forEach(store => {
            if (!store.isActive) return;

            // Alcohol licenses
            if (store.alcoholLicenseExpiry) {
                const expiryDate = new Date(store.alcoholLicenseExpiry);
                if (expiryDate >= today) {
                    stats.activeAlcohol++;
                    if (expiryDate <= threeMonthsFromNow) {
                        stats.expiringAlcohol++;
                    }
                }
            }

            // Tobacco licenses
            if (store.tobaccoLicenseExpiry) {
                const expiryDate = new Date(store.tobaccoLicenseExpiry);
                if (expiryDate >= today) {
                    stats.activeTobacco++;
                    if (expiryDate <= threeMonthsFromNow) {
                        stats.expiringTobacco++;
                    }
                }
            }
        });

        return stats;
    },
};
