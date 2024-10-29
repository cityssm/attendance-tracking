import type { Request, Response } from 'express';
import type { ReturnToWorkRecord } from '../../types/recordTypes.js';
export type DoDeleteReturnToWorkRecordResponse = {
    success: false;
    errorMessage: string;
} | {
    success: boolean;
    returnToWorkRecords: ReturnToWorkRecord[];
};
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
