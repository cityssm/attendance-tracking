import type { AfterHoursRecord, User } from '../types/recordTypes';
interface GetAfterHoursRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAfterHoursRecords(filters: GetAfterHoursRecordsFilters, sessionUser: User): Promise<AfterHoursRecord[]>;
export {};
