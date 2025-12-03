import api from './api';
import type { Payment, PaymentStatus, PaymentType } from '../types';

const PAYMENT_URL = '/payments';

interface CreatePaymentRequest {
    taskId: number;
    amount: number;
    notes?: string;
    type?: PaymentType;
}

export const paymentService = {
    async createPayment(request: CreatePaymentRequest): Promise<Payment> {
        const response = await api.post<Payment>(PAYMENT_URL, request);
        return response.data;
    },

    async updatePaymentStatus(id: number, status: PaymentStatus): Promise<Payment> {
        const response = await api.put<Payment>(`${PAYMENT_URL}/${id}/status`, { status });
        return response.data;
    },

    async getAllPayments(): Promise<Payment[]> {
        const response = await api.get<Payment[]>(PAYMENT_URL);
        return response.data;
    },

    async getTaskPayments(taskId: number): Promise<Payment[]> {
        const response = await api.get<Payment[]>(`${PAYMENT_URL}/task/${taskId}`);
        return response.data;
    },
};
