import type { AbsenceRecord } from '../types/recordTypes.js';
export declare function getAbsenceRecord(recordId: string, sessionUser: MonTYUser): Promise<AbsenceRecord | undefined>;
