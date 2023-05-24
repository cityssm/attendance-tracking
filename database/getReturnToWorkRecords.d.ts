import type { ReturnToWorkRecord } from '../types/recordTypes.js';
interface GetReturnToWorkRecordsFilters {
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getReturnToWorkRecords(filters: GetReturnToWorkRecordsFilters): Promise<ReturnToWorkRecord[]>;
export {};
