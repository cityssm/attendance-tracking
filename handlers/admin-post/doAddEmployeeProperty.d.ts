import type { Request, Response } from 'express';
import type { EmployeeProperty } from '../../types/recordTypes.js';
export interface DoAddEmployeePropertyResponse {
    success: boolean;
    employeeProperties: EmployeeProperty[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
