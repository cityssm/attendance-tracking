type BooleanFieldValues = '0' | '1' | 0 | 1 | false | true;
export declare function updateUserCanLogin(userName: string, canLogin: BooleanFieldValues, sessionUser: AttendUser): Promise<boolean>;
export declare function updateUserIsAdmin(userName: string, isAdmin: BooleanFieldValues, sessionUser: AttendUser): Promise<boolean>;
export {};
