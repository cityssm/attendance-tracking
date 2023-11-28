import type { AfterHoursRecord } from '../types/recordTypes.js';
export declare function getAfterHoursRecord(recordId: string, sessionUser: AttendUser): Promise<AfterHoursRecord | undefined>;
