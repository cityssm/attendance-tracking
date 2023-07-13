import type { CacheTableName } from '../types/applicationTypes.js';
import type * as recordTypes from '../types/recordTypes.js';
export declare function getAbsenceTypes(): Promise<recordTypes.AbsenceType[]>;
export declare function getAfterHoursReasons(): Promise<recordTypes.AfterHoursReason[]>;
export declare function getCallOutResponseTypes(): Promise<recordTypes.CallOutResponseType[]>;
export declare function getEmployeePropertyNames(): Promise<string[]>;
export declare function clearCacheByTableName(tableName: CacheTableName, relayMessage?: boolean): void;
