import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'
import { hasPermission } from '../helpers/functions.permissions.js'

export type ReportParameters = Record<string, string | number>

const recentDays = getConfigProperty('settings.recentDays')

const absenceRecordsRecentSQL = `select r.recordId,
  r.employeeNumber, r.employeeName,
  r.absenceDateTime, r.returnDateTime,
  t.absenceType,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.AbsenceRecords r
  left join MonTY.AbsenceTypes t on r.absenceTypeKey = t.absenceTypeKey
  where r.recordDelete_datetime is null
  and datediff(day, r.absenceDateTime, getdate()) <= @recentDays`

const returnToWorkRecordsRecentSQL = `select r.recordId,
  r.employeeNumber, r.employeeName,
  r.returnDateTime, r.returnShift,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.ReturnToWorkRecords r
  where r.recordDelete_datetime is null
  and datediff(day, r.returnDateTime, getdate()) <= @recentDays`

const callOutRecordsRecentSQL = `select r.recordId,
  r.listId, l.listName,
  r.employeeNumber, e.employeeSurname, e.employeeGivenName,
  r.callOutDateTime, r.callOutHours, r.natureOfCallOut,
  t.responseType, t.isSuccessful,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.CallOutRecords r
  left join MonTY.CallOutLists l on r.listId = l.listId
  left join MonTY.Employees e on r.employeeNumber = e.employeeNumber
  left join MonTY.CallOutResponseTypes t on r.responseTypeId = t.responseTypeId
  where r.recordDelete_datetime is null
  and datediff(day, r.callOutDateTime, getdate()) <= @recentDays`

const afterHoursRecordsRecentSQL = `select r.recordId,
  r.employeeNumber, r.employeeName,
  r.attendanceDateTime,
  t.afterHoursReason,
  r.recordComment,
  r.recordUpdate_userName, r.recordUpdate_dateTime
  from MonTY.AfterHoursRecords r
  left join MonTY.AfterHoursReasons t on r.afterHoursReasonId = t.afterHoursReasonId
  where r.recordDelete_datetime is null
  and datediff(day, r.attendanceDateTime, getdate()) <= @recentDays`

export async function getReportData(
  reportName: string,
  reportParameters: ReportParameters = {},
  user: MonTYUser
): Promise<unknown[] | undefined> {
  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  let request = pool.request()

  let sql = ''

  switch (reportName) {
    /*
     * Employees
     */

    case 'employees-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.callOuts.canView')
      ) {
        sql = 'select * from MonTY.Employees'
      }
      break
    }

    case 'employees-contacts': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `select
          employeeNumber, employeeSurname, employeeGivenName,
          jobTitle, department,
          workContact1, workContact2, homeContact1, homeContact2
          from MonTY.Employees
          where isActive = 1
          and recordDelete_dateTime is null
          order by employeeSurname, employeeGivenName, employeeNumber`
      }

      break
    }

    case 'employees-inactive': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `select
          employeeNumber, employeeSurname, employeeGivenName,
          jobTitle, department
          from MonTY.Employees
          where isActive = 0
          and recordDelete_dateTime is null
          order by employeeSurname, employeeGivenName, employeeNumber`
      }

      break
    }

    /*
     * Absence Records
     */

    case 'absenceRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.absences.canView')
      ) {
        sql = 'select * from MonTY.AbsenceRecords'
      }
      break
    }

    case 'absenceRecords-recent': {
      if (hasPermission(user, 'attendance.absences.canView')) {
        sql = `${absenceRecordsRecentSQL} order by r.absenceDateTime, r.recordId`
        request = request.input('recentDays', recentDays)
      }
      break
    }

    case 'absenceRecords-recent-byEmployeeNumber': {
      if (hasPermission(user, 'attendance.absences.canView')) {
        sql = `${absenceRecordsRecentSQL}
          and r.employeeNumber = @employeeNumber
          order by r.absenceDateTime, r.recordId`

        request = request
          .input('recentDays', recentDays)
          .input('employeeNumber', reportParameters.employeeNumber)
      }

      break
    }

    case 'historicalAbsenceRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.absences.canView')
      ) {
        sql = 'select * from MonTY.HistoricalAbsenceRecords'
      }

      break
    }

    case 'absenceTypes-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.absences.canView')
      ) {
        sql = 'select * from MonTY.AbsenceTypes'
      }

      break
    }

    case 'absenceTypes-active': {
      if (hasPermission(user, 'attendance.absences.canView')) {
        sql = `select absenceTypeKey, absenceType, orderNumber,
          recordUpdate_userName, recordUpdate_dateTime
          from MonTY.AbsenceTypes
          where recordDelete_dateTime is null
          order by orderNumber, absenceType`
      }

      break
    }

    /*
     * Return to Work Records
     */

    case 'returnToWorkRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.returnsToWork.canView')
      ) {
        sql = 'select * from MonTY.ReturnToWorkRecords'
      }

      break
    }

    case 'returnToWorkRecords-recent': {
      if (hasPermission(user, 'attendance.returnsToWork.canView')) {
        sql = `${returnToWorkRecordsRecentSQL} order by r.returnDateTime, r.recordId`
        request = request.input('recentDays', recentDays)
      }

      break
    }

    case 'returnToWorkRecords-recent-byEmployeeNumber': {
      if (hasPermission(user, 'attendance.returnsToWork.canView')) {
        sql = `${returnToWorkRecordsRecentSQL}
        and r.employeeNumber = @employeeNumber
        order by r.returnDateTime, r.recordId`

        request = request
          .input('recentDays', recentDays)
          .input('employeeNumber', reportParameters.employeeNumber)
      }

      break
    }

    case 'historicalReturnToWorkRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.returnsToWork.canView')
      ) {
        sql = 'select * from MonTY.HistoricalReturnToWorkRecords'
      }

      break
    }

    /*
     * Call Out List Members
     */

    case 'callOutListMembers-formatted': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `select m.listId, l.listName,
          m.employeeNumber, e.employeeSurname, e.employeeGivenName,
          e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
          m.sortKey
          from MonTY.CallOutListMembers m
          left join MonTY.CallOutLists l on m.listId = l.listId
          left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
          where m.recordDelete_datetime is null
          order by m.listId, m.sortKey, m.employeeNumber`
      }

      break
    }

    case 'callOutListMembers-formatted-byListId': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `select m.listId, l.listName,
          m.employeeNumber, e.employeeSurname, e.employeeGivenName,
          e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
          m.sortKey
          from MonTY.CallOutListMembers m
          left join MonTY.CallOutLists l on m.listId = l.listId
          left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
          where m.recordDelete_datetime is null
          and m.listId = @listId
          order by m.listId, m.sortKey, m.employeeNumber`

        request = request.input('listId', reportParameters.listId)
      }

      break
    }

    /*
     * Call Out Records
     */

    case 'callOutRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.callOuts.canView')
      ) {
        sql = 'select * from MonTY.CallOutRecords'
      }

      break
    }

    case 'callOutRecords-recent': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `${callOutRecordsRecentSQL} order by r.callOutDateTime, r.recordId`

        request = request.input('recentDays', recentDays)
      }

      break
    }

    case 'callOutRecords-recent-byListId': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `${callOutRecordsRecentSQL}
          and r.listId = @listId
          order by r.callOutDateTime, r.recordId`

        request = request
          .input('recentDays', recentDays)
          .input('listId', reportParameters.listId)
      }

      break
    }

    case 'callOutRecords-recent-byEmployeeNumber': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `${callOutRecordsRecentSQL}
          and r.employeeNumber = @employeeNumber
          order by r.callOutDateTime, r.recordId`

        request = request
          .input('recentDays', recentDays)
          .input('employeeNumber', reportParameters.employeeNumber)
      }

      break
    }

    case 'historicalCallOutRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.callOuts.canView')
      ) {
        sql = 'select * from MonTY.HistoricalCallOutRecords'
      }

      break
    }

    case 'callOutResponseTypes-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.callOuts.canView')
      ) {
        sql = 'select * from MonTY.CallOutResponseTypes'
      }

      break
    }

    case 'callOutResponseTypes-active': {
      if (hasPermission(user, 'attendance.callOuts.canView')) {
        sql = `select responseTypeId, responseType, isSuccessful, orderNumber,
          recordUpdate_userName, recordUpdate_dateTime
          from MonTY.CallOutResponseTypes
          where recordDelete_dateTime is null
          order by orderNumber, responseType`
      }

      break
    }

    /*
     * After Hours Records
     */

    case 'afterHoursRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.afterHours.canView')
      ) {
        sql = 'select * from MonTY.AfterHoursRecords'
      }

      break
    }

    case 'afterHoursRecords-recent': {
      if (hasPermission(user, 'attendance.afterHours.canView')) {
        sql = `${afterHoursRecordsRecentSQL} order by r.attendanceDateTime, r.recordId`
        request = request.input('recentDays', recentDays)
      }

      break
    }

    case 'afterHoursRecords-recent-byEmployeeNumber': {
      if (hasPermission(user, 'attendance.afterHours.canView')) {
        sql = `${afterHoursRecordsRecentSQL}
          and r.employeeNumber = @employeeNumber
          order by r.attendanceDateTime, r.recordId`

        request = request
          .input('recentDays', recentDays)
          .input('employeeNumber', reportParameters.employeeNumber)
      }

      break
    }

    case 'historicalAfterHoursRecords-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.afterHours.canView')
      ) {
        sql = 'select * from MonTY.HistoricalAfterHoursRecords'
      }

      break
    }

    case 'afterHoursReasons-all': {
      if (
        hasPermission(user, 'reports.hasRawExports') &&
        hasPermission(user, 'attendance.afterHours.canView')
      ) {
        sql = 'select * from MonTY.AfterHoursReasons'
      }

      break
    }

    case 'afterHoursReasons-active': {
      if (hasPermission(user, 'attendance.afterHours.canView')) {
        sql = `select afterHoursReasonId, afterHoursReason, orderNumber,
          recordUpdate_userName, recordUpdate_dateTime
          from MonTY.AfterHoursReasons
          where recordDelete_dateTime is null
          order by orderNumber, afterHoursReason`
      }

      break
    }

    /*
     * Default
     */

    default: {
      return undefined
    }
  }

  if (sql === '') {
    return undefined
  } else {
    const result = await request.query(sql)
    return result.recordset
  }
}

export default getReportData
