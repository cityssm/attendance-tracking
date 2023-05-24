import type { AbsenceRecord } from '../types/recordTypes.js';
interface GetAbsenceRecordsFilters {
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAbsenceRecords(filters: GetAbsenceRecordsFilters): Promise<AbsenceRecord[]>;
export {};
