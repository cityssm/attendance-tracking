import type { AfterHoursRecord, PartialSession } from '../types/recordTypes';
export declare function getAfterHoursRecord(recordId: string, requestSession: PartialSession): Promise<AfterHoursRecord | undefined>;
