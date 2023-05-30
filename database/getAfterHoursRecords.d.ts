import type { AfterHoursRecord } from '../types/recordTypes';
interface GetAfterHoursRecordsFilters {
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAfterHoursRecords(filters: GetAfterHoursRecordsFilters): Promise<AfterHoursRecord[]>;
export {};
