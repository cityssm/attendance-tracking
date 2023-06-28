import type * as recordTypes from '../types/recordTypes';
export declare function setUserPermission(userPermission: {
    userName: string;
    permissionKey: string;
    permissionValue: string;
}, sessionUser: recordTypes.User): Promise<boolean>;
