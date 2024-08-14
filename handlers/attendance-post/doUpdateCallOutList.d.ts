/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { CallOutList, CallOutListMember, Employee } from '../../types/recordTypes.js';
export interface DoUpdateCallOutListResponse {
    success: boolean;
    callOutLists: CallOutList[];
    callOutListMembers: CallOutListMember[];
    availableEmployees: Employee[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
