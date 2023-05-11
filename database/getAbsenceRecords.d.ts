import type { AbsenceRecord } from '../types/recordTypes';
interface GetAbsenceRecordsFilters {
    employeeNumber?: string;
    recentOnly: boolean;
}
export declare function getAbsenceRecords(filters: GetAbsenceRecordsFilters): Promise<AbsenceRecord[]>;
export {};
