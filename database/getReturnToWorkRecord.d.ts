import type { ReturnToWorkRecord, User } from '../types/recordTypes';
export declare function getReturnToWorkRecord(recordId: string, sessionUser: User): Promise<ReturnToWorkRecord | undefined>;
