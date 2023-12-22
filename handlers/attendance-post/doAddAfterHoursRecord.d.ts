import type { Request, Response } from 'express';
import type { AfterHoursRecord } from '../../types/recordTypes.js';
export interface DoAddAfterHoursRecordResponse {
    success: true;
    recordId: string;
    afterHoursRecords: AfterHoursRecord[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
