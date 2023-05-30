import type { AbsenceRecord, PartialSession } from '../types/recordTypes';
export declare function getAbsenceRecord(recordId: string, requestSession: PartialSession): Promise<AbsenceRecord | undefined>;
