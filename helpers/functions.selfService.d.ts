/// <reference types="cookie-parser" />
import type { Request } from 'express';
type EmployeeValidation = {
    success: true;
    employeeNumber: string;
    employeeSurname: string;
    employeeGivenName: string;
} | {
    success: false;
    errorMessage: string;
};
interface ValidateEmployeeFieldsRequest extends Partial<Request> {
    body: {
        employeeNumber: string;
        employeeHomeContactLastFourDigits: string;
    };
}
export declare function validateEmployeeFields(request: ValidateEmployeeFieldsRequest): Promise<EmployeeValidation>;
export {};
