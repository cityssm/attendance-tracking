import type { Request, Response } from 'express';
export interface DoAddUserResponse {
    success: boolean;
    users: AttendUser[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
