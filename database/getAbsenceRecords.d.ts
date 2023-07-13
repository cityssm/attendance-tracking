import type { AbsenceRecord } from '../types/recordTypes.js';
interface GetAbsenceRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAbsenceRecords(filters: GetAbsenceRecordsFilters, sessionUser: MonTYUser): Promise<AbsenceRecord[]>;
export {};
