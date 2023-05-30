import type { PartialSession, ReturnToWorkRecord } from '../types/recordTypes';
export declare function getReturnToWorkRecord(recordId: string, requestSession: PartialSession): Promise<ReturnToWorkRecord | undefined>;
