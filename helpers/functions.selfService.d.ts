import type { Request } from 'express';
interface EmployeeValidation {
    success: boolean;
    errorMessage?: string;
    employeeNumber?: string;
    employeeSurname?: string;
    employeeGivenName?: string;
}
export declare function validateEmployeeFields(request: Request): Promise<EmployeeValidation>;
export {};
