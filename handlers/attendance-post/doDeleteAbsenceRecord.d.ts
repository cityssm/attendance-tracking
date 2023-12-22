import type { Request, Response } from 'express';
import type { AbsenceRecord } from '../../types/recordTypes.js';
export type DoDeleteAbsenceRecordResponse = {
    success: false;
    errorMessage: string;
} | {
    success: boolean;
    absenceRecords: AbsenceRecord[];
};
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
