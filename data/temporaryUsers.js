export const adminUser = {
    userName: '~~monty.admin',
    isAdmin: true,
    canLogin: true,
    permissions: {}
};
export const manageUser = {
    userName: '~~monty.manage',
    isAdmin: true,
    canLogin: true,
    permissions: {
        'attendance.absences.canManage': 'true',
        'attendance.absences.canUpdate': 'true',
        'attendance.absences.canView': 'true',
        'attendance.afterHours.canManage': 'true',
        'attendance.afterHours.canUpdate': 'true',
        'attendance.afterHours.canView': 'true',
        'attendance.callOuts.canManage': 'true',
        'attendance.callOuts.canUpdate': 'true',
        'attendance.callOuts.canView': 'true',
        'attendance.returnsToWork.canManage': 'true',
        'attendance.returnsToWork.canUpdate': 'true',
        'attendance.returnsToWork.canView': 'true',
        'reports.hasRawExports': 'true'
    }
};
