import type { Request, Response } from 'express';
import type { EmployeeProperty } from '../../types/recordTypes.js';
export interface DoModifyEmployeePropertyResponse {
    success: boolean;
    employeeProperties: EmployeeProperty[];
}
export declare function doAddEmployeePropertyHandler(request: Request, response: Response): Promise<void>;
export declare function doDeleteEmployeePropertyHandler(request: Request, response: Response): Promise<void>;
export declare function doUpdateEmployeePropertyHandler(request: Request, response: Response): Promise<void>;
