import type { Request, Response } from 'express';
export interface DoUpdateCallOutResponseTypeResponse {
    success: boolean;
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
