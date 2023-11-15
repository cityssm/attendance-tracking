import type { availablePermissionValues } from '../helpers/functions.permissions.js';
export interface RecordUserNameDateTime {
    recordCreate_userName: string;
    recordCreate_dateTime: Date | string;
    recordUpdate_userName: string;
    recordUpdate_dateTime: Date | string;
    recordDelete_userName?: string;
    recordDelete_dateTime?: Date;
}
export interface Employee extends Partial<RecordUserNameDateTime> {
    employeeNumber: string;
    employeeSurname: string;
    employeeGivenName: string;
    userName: string;
    workContact1: string;
    workContact2: string;
    homeContact1: string;
    homeContact2: string;
    syncContacts: boolean;
    jobTitle: string;
    department: string;
    seniorityDateTime?: string | Date;
    isSynced: boolean;
    syncDateTime?: Date;
    isActive: boolean;
    employeeProperties?: EmployeeProperty[];
}
export interface EmployeeProperty extends Partial<RecordUserNameDateTime> {
    employeeNumber?: string;
    propertyName: string;
    propertyValue: string;
    isSynced?: boolean;
}
export interface AbsenceType extends Partial<RecordUserNameDateTime> {
    absenceTypeKey: string;
    absenceType: string;
    orderNumber?: number;
}
export interface AbsenceRecord extends Partial<AbsenceType>, Partial<RecordUserNameDateTime> {
    recordId: string;
    employeeNumber?: string;
    employeeName: string;
    absenceDateTime: string | Date;
    absenceTypeKey: string;
    recordComment: string;
    returnDateTime?: string | Date;
    recordCreate_userName: string;
    recordCreate_dateTime: Date | string;
    canUpdate?: boolean;
}
export interface ReturnToWorkRecord extends Partial<RecordUserNameDateTime> {
    recordId: string;
    employeeNumber?: string;
    employeeName: string;
    returnDateTime: string | Date;
    returnShift?: string;
    recordComment: string;
    recordCreate_userName: string;
    recordCreate_dateTime: Date | string;
    canUpdate?: boolean;
}
export interface CallOutList extends Partial<RecordUserNameDateTime> {
    listId: string;
    listName: string;
    listDescription?: string;
    allowSelfSignUp?: boolean;
    selfSignUpKey?: string;
    hasSelfSignUpKey?: boolean;
    sortKeyFunction?: string;
    eligibilityFunction?: string;
    employeePropertyName?: string;
    callOutListMembersCount?: number;
    callOutListMembers?: CallOutListMember[];
    isFavourite?: boolean;
}
export interface CallOutListMember extends Employee, Partial<RecordUserNameDateTime> {
    listId: string;
    employeeNumber: string;
    sortKey?: string;
    isNext: boolean;
    sortKeyFunction?: string;
    employeePropertyName?: string;
    callOutDateTimeMax?: string | Date | null;
}
export interface CallOutResponseType extends Partial<RecordUserNameDateTime> {
    responseTypeId: number;
    responseType: string;
    isSuccessful: boolean | '0' | '1';
    orderNumber?: number;
}
export interface CallOutRecord extends Partial<CallOutResponseType>, Partial<CallOutList>, Partial<Employee>, Partial<RecordUserNameDateTime> {
    recordId: string;
    listId: string;
    employeeNumber: string;
    callOutDateTime: string | Date;
    callOutHours: number;
    natureOfCallOut: string;
    responseTypeId: number;
    recordComment: string;
}
export interface AfterHoursReason extends Partial<RecordUserNameDateTime> {
    afterHoursReasonId: number;
    afterHoursReason: string;
    orderNumber?: number;
}
export interface AfterHoursRecord extends Partial<AfterHoursReason>, Partial<RecordUserNameDateTime> {
    recordId: string;
    employeeNumber: string;
    employeeName: string;
    attendanceDateTime: string | Date;
    afterHoursReasonId: number;
    recordComment?: string;
    recordCreate_userName: string;
    recordCreate_dateTime: Date | string;
    canUpdate?: boolean;
}
declare global {
    interface MonTYUser extends Partial<RecordUserNameDateTime> {
        userName: string;
        canLogin: boolean;
        isAdmin: boolean;
        employeeNumber?: string;
        employeeSurname?: string;
        employeeGivenName?: string;
        permissions?: Partial<Record<keyof typeof availablePermissionValues, string>>;
    }
}
declare module 'express-session' {
    interface Session {
        user?: MonTYUser;
    }
}
