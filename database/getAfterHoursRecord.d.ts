import type { AfterHoursRecord, User } from '../types/recordTypes';
export declare function getAfterHoursRecord(recordId: string, sessionUser: User): Promise<AfterHoursRecord | undefined>;
