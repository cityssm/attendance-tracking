import type { Request, Response } from 'express';
import type { AfterHoursReason } from '../../types/recordTypes.js';
export interface DoMoveAfterHoursReasonResponse {
    success: boolean;
    afterHoursReasons: AfterHoursReason[];
}
export declare function doMoveAfterHoursReasonDownHandler(request: Request, response: Response): Promise<void>;
export declare function doMoveAfterHoursReasonUpHandler(request: Request, response: Response): Promise<void>;
