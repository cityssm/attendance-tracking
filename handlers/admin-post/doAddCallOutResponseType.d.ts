/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { CallOutResponseType } from '../../types/recordTypes.js';
export interface DoAddCallOutResponseTypeResponse {
    success: true;
    responseTypeId: string;
    callOutResponseTypes: CallOutResponseType[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
