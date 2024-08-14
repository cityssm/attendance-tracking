/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { CallOutList } from '../../types/recordTypes.js';
export interface DoCreateCallOutListResponse {
    success: boolean;
    listId: string;
    callOutLists: CallOutList[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
