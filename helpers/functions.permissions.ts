import type { User } from '../types/recordTypes'

const trueFalseStrings = ['true', 'false']

export const availablePermissionValues = {
  'attendance.absences.canView': trueFalseStrings,
  'attendance.absences.canUpdate': trueFalseStrings,
  'attendance.absences.canManage': trueFalseStrings,

  'attendance.callOuts.canView': trueFalseStrings,
  'attendance.callOuts.canUpdate': trueFalseStrings,
  'attendance.callOuts.canManage': trueFalseStrings,

  'attendance.returnsToWork.canView': trueFalseStrings,
  'attendance.returnsToWork.canUpdate': trueFalseStrings,
  'attendance.returnsToWork.canManage': trueFalseStrings
}

export function hasAttendance(user: User): boolean {
  return (
    user.permissions?.['attendance.absences.canView'] === 'true' ||
    user.permissions?.['attendance.callOuts.canView'] === 'true' ||
    user.permissions?.['attendance.returnsToWork.canView'] === 'true'
  )
}

export function hasPermission(user: User, permissionKey: string): boolean {
  return (user.permissions?.[permissionKey] ?? 'false') === 'true'
}