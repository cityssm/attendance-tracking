import type { AbsenceRecord, User } from '../types/recordTypes';
interface GetAbsenceRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAbsenceRecords(filters: GetAbsenceRecordsFilters, sessionUser: User): Promise<AbsenceRecord[]>;
export {};
