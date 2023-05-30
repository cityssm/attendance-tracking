import type { AbsenceRecord, PartialSession } from '../types/recordTypes';
interface GetAbsenceRecordsFilters {
    recordId?: string;
    employeeNumber?: string;
    recentOnly: boolean;
    todayOnly: boolean;
}
export declare function getAbsenceRecords(filters: GetAbsenceRecordsFilters, requestSession: PartialSession): Promise<AbsenceRecord[]>;
export {};
