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

export interface Region {
    id: number;
    licenseType?: string;
    name: string;
    regionCode?: string;
    regionGiid?: string;
    counterpartyCode?: string;
    counterpartyInn?: string;
    kpp?: string;
    settlementBik?: string;
    createdAt?: string;
    updatedAt?: string;
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

export const PaymentStatus = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    FAILED: 'FAILED',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentType = {
    STATE_FEE: 'STATE_FEE',
    FINE: 'FINE',
    OTHER: 'OTHER',
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

export interface Payment {
    id: number;
    taskId?: number;
    amount: number;
    status: PaymentStatus;
    type: PaymentType;
    paymentDate?: string;
    paymentReference?: string;
    notes?: string;
    createdAt: string;
    region?: string;
    retailNetwork?: string;
    legalEntity?: string;
    paymentRecipient?: string;
    storeIds?: number[];
}
