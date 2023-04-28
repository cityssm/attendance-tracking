import type { Request, Response, NextFunction } from 'express';
export declare const forbiddenStatus = 403;
export declare const forbiddenJSON: {
    success: boolean;
    message: string;
};
export declare function adminGetHandler(request: Request, response: Response, next: NextFunction): void;
export declare function adminPostHandler(request: Request, response: Response, next: NextFunction): void;
