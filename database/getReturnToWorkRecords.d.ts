import type { ReturnToWorkRecord, User } from '../types/recordTypes';
interface GetReturnToWorkRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getReturnToWorkRecords(filters: GetReturnToWorkRecordsFilters, sessionUser: User): Promise<ReturnToWorkRecord[]>;
export {};
