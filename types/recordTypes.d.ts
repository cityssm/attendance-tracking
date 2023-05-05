import { type availablePermissionValues } from '../helpers/functions.permissions';
export interface RecordUserNameDateTime {
    recordCreate_userName?: string;
    recordCreate_dateTime?: Date;
    recordUpdate_userName?: string;
    recordUpdate_dateTime?: number;
    recordDelete_userName?: string;
    recordDelete_dateTime?: number;
}
export interface Employee extends RecordUserNameDateTime {
    employeeNumber: string;
    employeeSurname: string;
    employeeGivenName: string;
    userName?: string;
    workContact1?: string;
    workContact2?: string;
    homeContact1?: string;
    homeContact2?: string;
    syncContacts?: boolean;
    jobTitle?: string;
    department?: string;
    seniorityDateTime?: string | Date;
    isSynced?: boolean;
    syncDateTime?: Date;
    isActive?: boolean;
    employeeProperties?: EmployeeProperty[];
}
export interface EmployeeProperty extends RecordUserNameDateTime {
    employeeNumber?: string;
    propertyName: string;
    propertyValue: string;
    isSynced?: boolean;
}
export interface CallOutList extends RecordUserNameDateTime {
    listId: string;
    listName: string;
    listDescription?: string;
    sortKeyFunction?: string;
    eligibilityFunction?: string;
    employeePropertyName?: string;
    callOutListMembersCount?: number;
    callOutListMembers?: CallOutListMember[];
}
export interface CallOutListMember extends Employee, RecordUserNameDateTime {
    listId: string;
    employeeNumber: string;
    sortKey?: string;
    isNext: boolean;
    sortKeyFunction?: string;
    employeePropertyName?: string;
}
export interface CallOutResponseType extends RecordUserNameDateTime {
    responseTypeId: number;
    responseType: string;
    isSuccessful: boolean;
    orderNumber?: number;
}
export interface CallOutRecord extends Partial<CallOutResponseType>, Partial<CallOutList>, Partial<Employee>, RecordUserNameDateTime {
    recordId: string;
    listId: string;
    employeeNumber: string;
    callOutDateTime: string | Date;
    callOutHours: number;
    responseTypeId: number;
    recordComment?: string;
}
export interface User extends RecordUserNameDateTime {
    userName: string;
    canLogin: boolean;
    isAdmin: boolean;
    permissions?: Partial<Record<keyof typeof availablePermissionValues, string>>;
}
declare module 'express-session' {
    interface Session {
        user?: User;
    }
}
export interface PartialSession {
    user?: User;
}
