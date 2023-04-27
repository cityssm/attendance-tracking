import type { availablePermissionValues } from '../helpers/functions.permissions.js';
export declare function getUserPermissions(userName: string): Promise<Partial<Record<keyof typeof availablePermissionValues, string>>>;
