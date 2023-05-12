import type { ReturnToWorkRecord } from '../types/recordTypes';
interface GetReturnToWorkRecordsFilters {
    employeeNumber?: string;
    recentOnly: boolean;
}
export declare function getReturnToWorkRecords(filters: GetReturnToWorkRecordsFilters): Promise<ReturnToWorkRecord[]>;
export {};
