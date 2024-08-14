/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { CallOutRecord } from '../../types/recordTypes.js';
export interface DoAddCallOutRecordResponse {
    success: true;
    recordId: string;
    callOutRecords: CallOutRecord[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
