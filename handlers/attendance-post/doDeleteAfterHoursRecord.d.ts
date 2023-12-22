import type { Request, Response } from 'express';
import type { AfterHoursRecord } from '../../types/recordTypes.js';
export type DoDeleteAfterHoursRecordResponse = {
    success: false;
    errorMessage: string;
} | {
    success: boolean;
    afterHoursRecords: AfterHoursRecord[];
};
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
