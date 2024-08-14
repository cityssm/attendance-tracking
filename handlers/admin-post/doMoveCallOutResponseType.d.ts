/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { CallOutResponseType } from '../../types/recordTypes.js';
export interface DoMoveCallOutResponseTypeResponse {
    success: boolean;
    callOutResponseTypes: CallOutResponseType[];
}
export declare function doMoveCallOutResponseTypeDownHandler(request: Request, response: Response): Promise<void>;
export declare function doMoveCallOutResponseTypeUpHandler(request: Request, response: Response): Promise<void>;
