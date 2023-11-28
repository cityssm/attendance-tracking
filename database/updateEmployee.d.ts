import type { Employee } from '../types/recordTypes.js';
export declare function updateEmployee(employee: Employee, isSyncUpdate: boolean, sessionUser: AttendUser): Promise<boolean>;
