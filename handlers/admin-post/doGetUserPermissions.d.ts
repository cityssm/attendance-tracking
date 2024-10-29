import type { Request, Response } from 'express';
import { type GetUserPermissionsReturn } from '../../database/getUserPermissions.js';
export interface DoGetUserPermissionsResponse {
    userPermissions: GetUserPermissionsReturn;
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
