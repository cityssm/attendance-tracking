export declare function setUserPermission(userPermission: {
    userName: string;
    permissionKey: string;
    permissionValue: string;
}, sessionUser: MonTYUser): Promise<boolean>;
