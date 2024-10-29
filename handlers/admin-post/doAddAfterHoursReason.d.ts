import type { Request, Response } from 'express';
import type { AfterHoursReason } from '../../types/recordTypes.js';
export interface DoAddAfterHoursReasonResponse {
    success: true;
    afterHoursReasonId: number;
    afterHoursReasons: AfterHoursReason[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
