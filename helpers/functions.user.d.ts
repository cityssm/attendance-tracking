import type { Request } from 'express';
export interface APIRequest {
    params?: {
        apiKey?: string;
    };
}
export declare function userIsAdmin(request: Request): boolean;
