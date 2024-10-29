import type { Request, Response } from 'express';
import type { CallOutRecord } from '../../types/recordTypes.js';
export interface DoDeleteCallOutRecordResponse {
    success: boolean;
    callOutRecords: CallOutRecord[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
