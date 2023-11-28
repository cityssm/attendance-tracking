const trueFalseStrings = ['true', 'false']

export const availablePermissionValues = {
  'attendance.absences.canView': trueFalseStrings,
  'attendance.absences.canUpdate': trueFalseStrings,
  'attendance.absences.canManage': trueFalseStrings,

  'attendance.afterHours.canView': trueFalseStrings,
  'attendance.afterHours.canUpdate': trueFalseStrings,
  'attendance.afterHours.canManage': trueFalseStrings,

  'attendance.callOuts.canView': trueFalseStrings,
  'attendance.callOuts.canUpdate': trueFalseStrings,
  'attendance.callOuts.canManage': trueFalseStrings,

  'attendance.returnsToWork.canView': trueFalseStrings,
  'attendance.returnsToWork.canUpdate': trueFalseStrings,
  'attendance.returnsToWork.canManage': trueFalseStrings,

  'reports.hasRawExports': trueFalseStrings
}

export function hasAttendance(user: AttendUser | undefined): boolean {
  if (user === undefined) {
    return false
  }

  return (
    user.permissions?.['attendance.absences.canView'] === 'true' ||
    user.permissions?.['attendance.afterHours.canView'] === 'true' ||
    user.permissions?.['attendance.callOuts.canView'] === 'true' ||
    user.permissions?.['attendance.returnsToWork.canView'] === 'true'
  )
}

export function hasPermission(
  user: AttendUser,
  permissionKey: keyof typeof availablePermissionValues
): boolean {
  return (user.permissions?.[permissionKey] ?? 'false') === 'true'
}

export default {
  hasAttendance,
  hasPermission
}
