import { connect as sqlPoolConnect } from '@cityssm/mssql-multi-pool'

import { getConfigProperty } from '../helpers/functions.config.js'
import {
  type availablePermissionKeys,
  hasPermission
} from '../helpers/functions.permissions.js'

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

interface Report {
  sql: string
  permissions: availablePermissionKeys[]
  inputs?: (
    reportParameters: ReportParameters
  ) => Record<string, string | number>
}

const reports: Record<string, Report> = {
  'employees-all': {
    sql: 'select * from MonTY.Employees',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
  },
  'employees-contacts': {
    sql: `select
      employeeNumber, employeeSurname, employeeGivenName,
      jobTitle, department,
      workContact1, workContact2, homeContact1, homeContact2
      from MonTY.Employees
      where isActive = 1
      and recordDelete_dateTime is null
      order by employeeSurname, employeeGivenName, employeeNumber`,
    permissions: ['attendance.callOuts.canView']
  },
  'employees-inactive': {
    sql: `select
      employeeNumber, employeeSurname, employeeGivenName,
      jobTitle, department
      from MonTY.Employees
      where isActive = 0
      and recordDelete_dateTime is null
      order by employeeSurname, employeeGivenName, employeeNumber`,
    permissions: ['attendance.callOuts.canView']
  },
  'absenceRecords-all': {
    sql: 'select * from MonTY.AbsenceRecords',
    permissions: ['reports.hasRawExports', 'attendance.absences.canView']
  },
  'absenceRecords-recent': {
    sql: `${absenceRecordsRecentSQL} order by r.absenceDateTime, r.recordId`,
    permissions: ['attendance.absences.canView'],
    inputs() {
      return {
        recentDays
      }
    }
  },
  'absenceRecords-recent-byEmployeeNumber': {
    sql: `${absenceRecordsRecentSQL}
      and r.employeeNumber = @employeeNumber
      order by r.absenceDateTime, r.recordId`,
    permissions: ['attendance.absences.canView'],
    inputs(reportParameters = {}) {
      return {
        recentDays,
        employeeNumber: reportParameters.employeeNumber
      }
    }
  },
  'historicalAbsenceRecords-all': {
    sql: 'select * from MonTY.HistoricalAbsenceRecords',
    permissions: ['reports.hasRawExports', 'attendance.absences.canView']
  },
  'absenceTypes-all': {
    sql: 'select * from MonTY.AbsenceTypes',
    permissions: ['reports.hasRawExports', 'attendance.absences.canView']
  },
  'absenceTypes-active': {
    sql: `select absenceTypeKey, absenceType, orderNumber,
      recordUpdate_userName, recordUpdate_dateTime
      from MonTY.AbsenceTypes
      where recordDelete_dateTime is null
      order by orderNumber, absenceType`,
    permissions: ['attendance.absences.canView']
  },
  'returnToWorkRecords-all': {
    sql: 'select * from MonTY.ReturnToWorkRecords',
    permissions: ['reports.hasRawExports', 'attendance.returnsToWork.canView']
  },
  'returnToWorkRecords-recent': {
    sql: `${returnToWorkRecordsRecentSQL}
      order by r.returnDateTime, r.recordId`,
    permissions: ['attendance.returnsToWork.canView'],
    inputs() {
      return {
        recentDays
      }
    }
  },
  'returnToWorkRecords-recent-byEmployeeNumber': {
    sql: `${returnToWorkRecordsRecentSQL}
      and r.employeeNumber = @employeeNumber
      order by r.returnDateTime, r.recordId`,
    permissions: ['attendance.returnsToWork.canView'],
    inputs(reportParameters = {}) {
      return {
        recentDays,
        employeeNumber: reportParameters.employeeNumber
      }
    }
  },
  'historicalReturnToWorkRecords-all': {
    sql: 'select * from MonTY.HistoricalReturnToWorkRecords',
    permissions: ['reports.hasRawExports', 'attendance.returnsToWork.canView']
  },
  'callOutListMembers-formatted': {
    sql: `select m.listId, l.listName,
      m.employeeNumber, e.employeeSurname, e.employeeGivenName,
      e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
      m.sortKey
      from MonTY.CallOutListMembers m
      left join MonTY.CallOutLists l on m.listId = l.listId
      left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
      where m.recordDelete_datetime is null
      order by m.listId, m.sortKey, m.employeeNumber`,
    permissions: ['attendance.callOuts.canView']
  },
  'callOutListMembers-formatted-byListId': {
    sql: `select m.listId, l.listName,
      m.employeeNumber, e.employeeSurname, e.employeeGivenName,
      e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
      m.sortKey
      from MonTY.CallOutListMembers m
      left join MonTY.CallOutLists l on m.listId = l.listId
      left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
      where m.recordDelete_datetime is null
      and m.listId = @listId
      order by m.listId, m.sortKey, m.employeeNumber`,
    permissions: ['attendance.callOuts.canView'],
    inputs(reportParameters = {}) {
      return {
        listId: reportParameters.listId
      }
    }
  },
  'callOutRecords-all': {
    sql: 'select * from MonTY.CallOutRecords',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
  },
  'callOutRecords-recent': {
    sql: `${callOutRecordsRecentSQL} order by r.callOutDateTime, r.recordId`,
    permissions: ['attendance.callOuts.canView'],
    inputs() {
      return {
        recentDays
      }
    }
  },
  'callOutRecords-recent-byListId': {
    sql: `${callOutRecordsRecentSQL}
      and r.listId = @listId
      order by r.callOutDateTime, r.recordId`,
    permissions: ['attendance.callOuts.canView'],
    inputs(reportParameters = {}) {
      return {
        recentDays,
        listId: reportParameters.listId
      }
    }
  },
  'callOutRecords-recent-byEmployeeNumber': {
    sql: `${callOutRecordsRecentSQL}
      and r.employeeNumber = @employeeNumber
      order by r.callOutDateTime, r.recordId`,
    permissions: ['attendance.callOuts.canView'],
    inputs(reportParameters) {
      return {
        recentDays,
        employeeNumber: reportParameters.employeeNumber
      }
    }
  },
  'historicalCallOutRecords-all': {
    sql: 'select * from MonTY.HistoricalCallOutRecords',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
  },
  'callOutResponseTypes-all': {
    sql: 'select * from MonTY.CallOutResponseTypes',
    permissions: ['reports.hasRawExports', 'attendance.callOuts.canView']
  },
  'callOutResponseTypes-active': {
    sql: `select responseTypeId, responseType, isSuccessful, orderNumber,
      recordUpdate_userName, recordUpdate_dateTime
      from MonTY.CallOutResponseTypes
      where recordDelete_dateTime is null
      order by orderNumber, responseType`,
    permissions: ['attendance.callOuts.canView']
  },
  'afterHoursRecords-all': {
    sql: 'select * from MonTY.AfterHoursRecords',
    permissions: ['reports.hasRawExports', 'attendance.afterHours.canView']
  },
  'afterHoursRecords-recent': {
    sql: `${afterHoursRecordsRecentSQL} order by r.attendanceDateTime, r.recordId`,
    permissions: ['attendance.afterHours.canView'],
    inputs() {
      return {
        recentDays
      }
    }
  },
  'afterHoursRecords-recent-byEmployeeNumber': {
    sql: `${afterHoursRecordsRecentSQL}
      and r.employeeNumber = @employeeNumber
      order by r.attendanceDateTime, r.recordId`,
    permissions: ['attendance.afterHours.canView'],
    inputs(reportParameters = {}) {
      return {
        recentDays,
        employeeNumber: reportParameters.employeeNumber
      }
    }
  },
  'historicalAfterHoursRecords-all': {
    sql: 'select * from MonTY.HistoricalAfterHoursRecords',
    permissions: ['reports.hasRawExports', 'attendance.afterHours.canView']
  },
  'afterHoursReasons-all': {
    sql: 'select * from MonTY.AfterHoursReasons',
    permissions: ['reports.hasRawExports', 'attendance.afterHours.canView']
  },
  'afterHoursReasons-active': {
    sql: `select afterHoursReasonId, afterHoursReason, orderNumber,
      recordUpdate_userName, recordUpdate_dateTime
      from MonTY.AfterHoursReasons
      where recordDelete_dateTime is null
      order by orderNumber, afterHoursReason`,
    permissions: ['attendance.afterHours.canView']
  }
}

export async function getReportData(
  reportName: string,
  reportParameters: ReportParameters,
  user: AttendUser
): Promise<unknown[] | undefined> {
  const report = reports[reportName]

  if (report === undefined) {
    return undefined
  }

  for (const permission of report.permissions) {
    if (!hasPermission(user, permission)) {
      return undefined
    }
  }

  const pool = await sqlPoolConnect(getConfigProperty('mssql'))

  let request = pool.request()

  if (report.inputs !== undefined) {
    const inputs = report.inputs(reportParameters)
    for (const [parameterName, parameterValue] of Object.entries(inputs)) {
      request = request.input(parameterName, parameterValue)
    }
  }

  const result = await request.query(report.sql)
  return result.recordset
}

export default getReportData
