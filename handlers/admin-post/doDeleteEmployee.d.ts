/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { Employee } from '../../types/recordTypes.js';
export interface DoDeleteEmployeeResponse {
    success: boolean;
    employees: Employee[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
