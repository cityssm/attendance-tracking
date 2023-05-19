import type { User } from '../types/recordTypes';
export declare const availablePermissionValues: {
    'attendance.absences.canView': string[];
    'attendance.absences.canUpdate': string[];
    'attendance.absences.canManage': string[];
    'attendance.callOuts.canView': string[];
    'attendance.callOuts.canUpdate': string[];
    'attendance.callOuts.canManage': string[];
    'attendance.returnsToWork.canView': string[];
    'attendance.returnsToWork.canUpdate': string[];
    'attendance.returnsToWork.canManage': string[];
    'reports.hasRawExports': string[];
};
export declare function hasAttendance(user: User): boolean;
export declare function hasPermission(user: User, permissionKey: keyof typeof availablePermissionValues): boolean;
