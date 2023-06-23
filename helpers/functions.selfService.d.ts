import type { Request } from 'express';
interface EmployeeValidation {
    success: boolean;
    errorMessage?: string;
    employeeNumber?: string;
    employeeSurname?: string;
    employeeGivenName?: string;
}
interface ValidateEmployeeFieldsRequest extends Partial<Request> {
    body: {
        employeeNumber: string;
        employeeHomeContactLastFourDigits: string;
    };
}
export declare function validateEmployeeFields(request: ValidateEmployeeFieldsRequest): Promise<EmployeeValidation>;
export {};
