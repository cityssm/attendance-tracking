/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
export interface DoClearUserPermissionsResponse {
    success: boolean;
    users: AttendUser[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
