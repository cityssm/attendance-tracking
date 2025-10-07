import type { Employee } from '../types/recordTypes.js';
interface GetEmployeesFilters {
    eligibilityFunction?: {
        functionName: string;
        employeePropertyName: string;
    };
    isActive?: 'all' | boolean;
}
interface GetEmployeesOptions {
    includeProperties?: boolean;
    orderBy?: 'employeeNumber' | 'name';
}
export declare function getEmployees(filters: GetEmployeesFilters, options: GetEmployeesOptions): Promise<Employee[]>;
export {};
