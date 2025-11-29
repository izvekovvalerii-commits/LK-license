export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
    position?: string;
    department?: string;
    roles: string[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    id: number;
    username: string;
    email: string;
    fullName: string;
    roles: string[];
}

export const LicenseType = {
    ALCOHOL: 'ALCOHOL',
    TOBACCO: 'TOBACCO',
} as const;

export type LicenseType = typeof LicenseType[keyof typeof LicenseType];

export const ActionType = {
    NEW: 'NEW',
    RENEWAL: 'RENEWAL',
} as const;

export type ActionType = typeof ActionType[keyof typeof ActionType];

export const TaskStatus = {
    ASSIGNED: 'ASSIGNED',
    IN_PROGRESS: 'IN_PROGRESS',
    SUSPENDED: 'SUSPENDED',
    DONE: 'DONE',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface Task {
    id: number;
    title: string;
    description?: string;
    licenseType: LicenseType;
    actionType: ActionType;
    status: TaskStatus;
    statusReason?: string;
    storeId?: number;
    storeName?: string;
    assigneeId?: number;
    assigneeName?: string;
    createdById?: number;
    createdByName?: string;
    deadlineDate?: string;
    createdAt: string;
    updatedAt?: string;
    documentCount: number;
    paymentCount: number;
}

export interface TaskRequest {
    title: string;
    description?: string;
    licenseType: LicenseType;
    actionType: ActionType;
    storeId?: number;
    assigneeId?: number;
    deadlineDate?: string;
    status?: TaskStatus;
    statusReason?: string;
}

export interface Store {
    id: number;
    mvz: string;
    name: string;
    address: string;
    cfo: string;
    oktmo: string;
    hasRestriction: boolean;
    munArea: string;
    munDistrict: string;
    be: string;
    closeDate: string | null;
    directorPhone: string;
    inn: string;
    kpp: string;
    contactPerson: string;
    phone: string;
    email: string;
    alcoholLicenseExpiry: string | null;
    tobaccoLicenseExpiry: string | null;
    isActive: boolean;
}
