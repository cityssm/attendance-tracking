import type { AfterHoursRecord, PartialSession } from '../types/recordTypes';
interface GetAfterHoursRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAfterHoursRecords(filters: GetAfterHoursRecordsFilters, requestSession: PartialSession): Promise<AfterHoursRecord[]>;
export {};
