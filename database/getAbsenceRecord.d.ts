import type { AbsenceRecord, User } from '../types/recordTypes';
export declare function getAbsenceRecord(recordId: string, sessionUser: User): Promise<AbsenceRecord | undefined>;
