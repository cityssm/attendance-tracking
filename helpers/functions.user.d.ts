import type { User } from '../types/recordTypes.js';
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
