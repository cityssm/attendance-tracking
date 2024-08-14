/// <reference types="cookie-parser" />
import type { Request, Response } from 'express';
import type { EmployeeProperty } from '../../types/recordTypes.js';
export interface DoGetEmployeePropertiesResponse {
    employeeProperties: EmployeeProperty[];
}
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
