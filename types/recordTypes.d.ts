export interface Record {
    recordCreate_userName?: string;
    recordCreate_dateTime?: Date;
    recordUpdate_userName?: string;
    recordUpdate_dateTime?: number;
    recordDelete_userName?: string;
    recordDelete_dateTime?: number;
}
export interface User extends Record {
    userName: string;
    canLogin: boolean;
    canUpdate: boolean;
    isAdmin: boolean;
}
declare module 'express-session' {
    interface Session {
        user?: User;
    }
}
export interface PartialSession {
    user?: User;
}
