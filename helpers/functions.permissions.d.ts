export declare const availablePermissionValues: {
    'attendance.absences.canView': string[];
    'attendance.absences.canUpdate': string[];
    'attendance.absences.canManage': string[];
    'attendance.afterHours.canView': string[];
    'attendance.afterHours.canUpdate': string[];
    'attendance.afterHours.canManage': string[];
    'attendance.callOuts.canView': string[];
    'attendance.callOuts.canUpdate': string[];
    'attendance.callOuts.canManage': string[];
    'attendance.returnsToWork.canView': string[];
    'attendance.returnsToWork.canUpdate': string[];
    'attendance.returnsToWork.canManage': string[];
    'reports.hasRawExports': string[];
};
export type availablePermissionKeys = keyof typeof availablePermissionValues;
export declare function hasAttendance(user: AttendUser | undefined): boolean;
export declare function hasPermission(user: AttendUser, permissionKey: availablePermissionKeys): boolean;
declare const _default: {
    hasAttendance: typeof hasAttendance;
    hasPermission: typeof hasPermission;
};
export default _default;
