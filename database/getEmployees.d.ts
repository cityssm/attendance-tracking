import '../helpers/polyfills.js';
import type { Employee } from '../types/recordTypes.js';
interface GetEmployeesFilters {
    eligibilityFunction?: {
        functionName: string;
        employeePropertyName: string;
    };
    isActive?: boolean | 'all';
}
interface GetEmployeesOptions {
    includeProperties?: boolean;
    orderBy?: 'name' | 'employeeNumber';
}
export declare function getEmployees(filters: GetEmployeesFilters, options: GetEmployeesOptions): Promise<Employee[]>;
export {};
