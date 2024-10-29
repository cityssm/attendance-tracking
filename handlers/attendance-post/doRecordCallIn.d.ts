import type { Request, Response } from 'express';
import type { AbsenceRecord, ReturnToWorkRecord } from '../../types/recordTypes.js';
export interface DoRecordCallInResponse {
    success: boolean;
    recordId: string;
    callInType: 'absence' | 'returnToWork';
    absenceRecords: AbsenceRecord[];
    returnToWorkRecords: ReturnToWorkRecord[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
