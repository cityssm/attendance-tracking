/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
export interface DoModifyUserResponse {
    success: boolean;
    users: AttendUser[];
}
export declare function doAddUserHandler(request: Request, response: Response): Promise<void>;
export declare function doDeleteUserHandler(request: Request, response: Response): Promise<void>;
export declare function doUpdateUserCanLoginHandler(request: Request, response: Response): Promise<void>;
export declare function doUpdateUserIsAdminHandler(request: Request, response: Response): Promise<void>;
