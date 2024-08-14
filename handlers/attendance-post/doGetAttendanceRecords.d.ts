/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { AbsenceRecord, CallOutRecord, ReturnToWorkRecord } from '../../types/recordTypes.js';
export interface DoGetAttendanceRecordsResponse {
    absenceRecords: AbsenceRecord[];
    returnToWorkRecords: ReturnToWorkRecord[];
    callOutRecords: CallOutRecord[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
