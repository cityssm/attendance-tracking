import type { availablePermissionValues } from '../helpers/functions.permissions.js';
export type GetUserPermissionsReturn = Partial<Record<keyof typeof availablePermissionValues, string>>;
export declare function getUserPermissions(userName: string): Promise<GetUserPermissionsReturn>;
