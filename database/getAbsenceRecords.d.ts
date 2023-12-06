import type { AbsenceRecord } from '../types/recordTypes.js';
interface GetAbsenceRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
interface GetAbsenceRecordsOptions {
    includeCallOutListIds?: boolean;
}
export declare function getAbsenceRecords(filters: GetAbsenceRecordsFilters, options: GetAbsenceRecordsOptions, sessionUser: AttendUser): Promise<AbsenceRecord[]>;
export {};
