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

    async getTaskStats(): Promise<{ status: string; count: number }[]> {
        // Calculate stats from all tasks
        const tasks = await this.getAllTasks();
        const stats = tasks.reduce((acc, task) => {
            const existing = acc.find(s => s.status === task.status);
            if (existing) {
                existing.count++;
            } else {
                acc.push({ status: task.status, count: 1 });
            }
            return acc;
        }, [] as { status: string; count: number }[]);
        return stats;
    },

    async getTaskTrend(days: number = 30): Promise<{ date: string; completed: number; created: number }[]> {
        // Get tasks and group by date
        const tasks = await this.getAllTasks();
        const today = new Date();
        const trend: { date: string; completed: number; created: number }[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const completed = tasks.filter(t =>
                t.actualEndDate && t.actualEndDate.startsWith(dateStr)
            ).length;

            const created = tasks.filter(t =>
                t.createdAt && t.createdAt.startsWith(dateStr)
            ).length;

            trend.push({ date: dateStr, completed, created });
        }

        return trend;
    },

    async getOverdueTasks(): Promise<Task[]> {
        const tasks = await this.getAllTasks();
        const today = new Date().toISOString().split('T')[0];
        return tasks.filter(t =>
            t.deadlineDate &&
            t.deadlineDate < today &&
            t.status !== 'DONE'
        );
    },

    async getUnassignedTasks(): Promise<Task[]> {
        const tasks = await this.getAllTasks();
        return tasks.filter(t => !t.assigneeId && t.status !== 'DONE');
    },
};
