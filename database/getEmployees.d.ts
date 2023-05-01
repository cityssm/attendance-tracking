import '../helpers/polyfills.js';
import type { Employee } from '../types/recordTypes';
interface GetEmployeesFilters {
    eligibilityFunctionName?: string;
    isActive?: boolean;
}
interface GetEmployeesOptions {
    includeProperties?: boolean;
    orderBy?: 'name' | 'employeeNumber';
}
export declare function getEmployees(filters: GetEmployeesFilters, options: GetEmployeesOptions): Promise<Employee[]>;
export {};
