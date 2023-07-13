import type { AfterHoursRecord } from '../types/recordTypes.js';
interface GetAfterHoursRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAfterHoursRecords(filters: GetAfterHoursRecordsFilters, sessionUser: MonTYUser): Promise<AfterHoursRecord[]>;
export {};
