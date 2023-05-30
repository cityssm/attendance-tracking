import type { PartialSession, ReturnToWorkRecord } from '../types/recordTypes.js';
interface GetReturnToWorkRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getReturnToWorkRecords(filters: GetReturnToWorkRecordsFilters, requestSession: PartialSession): Promise<ReturnToWorkRecord[]>;
export {};
