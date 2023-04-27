import type { User } from '../types/recordTypes';
export interface UserRequest {
    session?: {
        user?: User;
    };
}
export interface APIRequest {
    params?: {
        apiKey?: string;
    };
}
export declare function userIsAdmin(request: UserRequest): boolean;
