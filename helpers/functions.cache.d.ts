import type { CacheTableName } from '../types/applicationTypes.js';
import type { AbsenceType, AfterHoursReason, CallOutResponseType, EmployeeProperty } from '../types/recordTypes.js';
export declare function getAbsenceTypes(): Promise<AbsenceType[]>;
export declare function getAfterHoursReasons(): Promise<AfterHoursReason[]>;
export declare function getCallOutResponseTypes(): Promise<CallOutResponseType[]>;
export declare function getEmployeePropertyNames(): Promise<string[]>;
export declare function getEmployeeProperties(employeeNumber: string): Promise<EmployeeProperty[]>;
export declare function clearCacheByTableName(tableName: CacheTableName, relayMessage?: boolean): void;
