import type { Request, Response } from 'express';
import type { Employee } from '../../types/recordTypes.js';
export type DoAddEmployeeResponse = {
    success: false;
} | {
    success: true;
    employeeNumber: string;
    employees: Employee[];
};
export declare function handler(request: Request, response: Response): Promise<void>;
export default handler;
