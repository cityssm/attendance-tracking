/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { CallOutRecord } from '../../types/recordTypes.js';
export interface DoUpdateCallOutRecordResponse {
    success: boolean;
    callOutRecords: CallOutRecord[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
