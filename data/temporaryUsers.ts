import type { ConfigTemporaryUser } from '../types/configTypes.js'

/*
 * Note that passwords must be set after import to use.
 */

export const adminUser: ConfigTemporaryUser = {
  userName: '~~attend.admin',
  isAdmin: true,
  canLogin: true,
  permissions: {}
}

export const manageUser: ConfigTemporaryUser = {
  userName: '~~attend.manage',
  isAdmin: false,
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
}

export const readOnlyUser: ConfigTemporaryUser = {
  userName: '~~attend.read',
  isAdmin: false,
  canLogin: true,
  permissions: {
    'attendance.absences.canView': 'true',
    'attendance.afterHours.canView': 'true',
    'attendance.callOuts.canView': 'true',
    'attendance.returnsToWork.canView': 'true'
  }
}
