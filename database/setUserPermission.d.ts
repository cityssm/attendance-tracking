import type * as recordTypes from '../types/recordTypes.js';
export declare function setUserPermission(userPermission: {
    userName: string;
    permissionKey: string;
    permissionValue: string;
}, requestSession: recordTypes.PartialSession): Promise<boolean>;
