import type { Request } from 'express';
export interface APIRequest {
    params?: {
        apiKey?: string;
    };
}
export declare function userIsAdmin(request: Partial<Request>): boolean;
