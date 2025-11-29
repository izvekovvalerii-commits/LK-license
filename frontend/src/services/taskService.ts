import api from './api';
import type { Task, TaskRequest } from '../types';

export const taskService = {
    async getAllTasks(): Promise<Task[]> {
        const response = await api.get<Task[]>('/tasks');
        return response.data;
    },

    async getTaskById(id: number): Promise<Task> {
        const response = await api.get<Task>(`/tasks/${id}`);
        return response.data;
    },

    async createTask(task: TaskRequest): Promise<Task> {
        const response = await api.post<Task>('/tasks', task);
        return response.data;
    },

    async updateTask(id: number, task: TaskRequest): Promise<Task> {
        const response = await api.put<Task>(`/tasks/${id}`, task);
        return response.data;
    },

    async updateTaskStatus(id: number, status: string): Promise<Task> {
        const response = await api.put<Task>(`/tasks/${id}/status`, null, {
            params: { status },
        });
        return response.data;
    },

    async deleteTask(id: number): Promise<void> {
        await api.delete(`/tasks/${id}`);
    },

    async getUpcomingDeadlines(days: number = 7): Promise<Task[]> {
        const response = await api.get<Task[]>('/tasks/deadlines/upcoming', {
            params: { days },
        });
        return response.data;
    },
};
