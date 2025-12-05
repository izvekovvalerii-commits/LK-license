import api from './api';
import type { Region } from '../types';

export const regionService = {
    getAllRegions: async (): Promise<Region[]> => {
        const response = await api.get('/regions');
        return response.data;
    },

    getRegionById: async (id: number): Promise<Region> => {
        const response = await api.get(`/regions/${id}`);
        return response.data;
    },

    createRegion: async (region: Omit<Region, 'id' | 'createdAt' | 'updatedAt'>): Promise<Region> => {
        const response = await api.post('/regions', region);
        return response.data;
    },

    updateRegion: async (id: number, region: Omit<Region, 'id' | 'createdAt' | 'updatedAt'>): Promise<Region> => {
        const response = await api.put(`/regions/${id}`, region);
        return response.data;
    },

    deleteRegion: async (id: number): Promise<void> => {
        await api.delete(`/regions/${id}`);
    },

    searchByName: async (name: string): Promise<Region[]> => {
        const response = await api.get('/regions/search', { params: { name } });
        return response.data;
    },

    getByLicenseType: async (licenseType: string): Promise<Region[]> => {
        const response = await api.get('/regions/by-license-type', { params: { licenseType } });
        return response.data;
    }
};
