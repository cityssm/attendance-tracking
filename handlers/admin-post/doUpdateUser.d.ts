import type { Request, Response } from 'express';
export interface DoUpdateUserResponse {
    success: boolean;
    users: AttendUser[];
}
export declare function doUpdateUserCanLoginHandler(request: Request, response: Response): Promise<void>;
export declare function doUpdateUserIsAdminHandler(request: Request, response: Response): Promise<void>;
