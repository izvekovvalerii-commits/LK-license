export interface ProjectTask {
    id?: number;
    projectId: number;
    name: string;
    taskType: string;
    responsible: string;
    normativeDeadline: string;
    actualDate?: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export const TASK_TYPES = [
    'Планирование аудита',
    'Согласование контура',
    'Расчет бюджета'
];

export const TASK_STATUSES = [
    'Назначена',
    'В работе',
    'Завершена',
    'Срыва сроков'
];

// Автоматическое назначение ответственных по типу задачи
export const TASK_RESPONSIBLE_MAP: { [key: string]: string } = {
    'Планирование аудита': 'НОР',
    'Согласование контура': 'МП',
    'Расчет бюджета': 'СтМРиЗ'
};

// Нормативные сроки в днях
export const TASK_DEADLINE_DAYS: { [key: string]: number } = {
    'Планирование аудита': 7,
    'Согласование контура': 14,
    'Расчет бюджета': 21
};
