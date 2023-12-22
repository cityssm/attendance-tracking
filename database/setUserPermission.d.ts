export interface SetUserPermissionForm {
    userName: string;
    permissionKey: string;
    permissionValue: string;
}
export declare function setUserPermission(userPermission: SetUserPermissionForm): Promise<boolean>;
