export interface Record {
    recordCreate_userName?: string;
    recordCreate_dateTime?: Date;
    recordUpdate_userName?: string;
    recordUpdate_dateTime?: number;
    recordDelete_userName?: string;
    recordDelete_dateTime?: number;
}
export interface Employee extends Record {
    employeeNumber: string;
    employeeSurname: string;
    employeeGivenName: string;
    userName?: string;
    workContact1?: string;
    workContact2?: string;
    homeContact1?: string;
    homeContact2?: string;
    jobTitle?: string;
    department?: string;
    seniorityDateTime?: Date;
    isSynced?: boolean;
    syncDateTime?: Date;
    isActive?: boolean;
}
export interface User extends Record {
    userName: string;
    canLogin: boolean;
    isAdmin: boolean;
}
declare module 'express-session' {
    interface Session {
        user?: User;
    }
}
export interface PartialSession {
    user?: User;
}
