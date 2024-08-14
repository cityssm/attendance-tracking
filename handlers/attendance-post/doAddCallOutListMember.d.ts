/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { CallOutListMember } from '../../types/recordTypes.js';
export interface DoAddCallOutListMemberResponse {
    success: boolean;
    callOutListMembers: CallOutListMember[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
