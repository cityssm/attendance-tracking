import * as sqlPool from '@cityssm/mssql-multi-pool'

import * as configFunctions from '../helpers/functions.config.js'

export type ReportParameters = Record<string, string | number>

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
  r.callOutDateTime, r.callOutHours,
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
  reportParameters: ReportParameters = {}
): Promise<unknown[] | undefined> {
  const pool = await sqlPool.connect(configFunctions.getProperty('mssql'))

  let request = pool.request()

  let sql: string

  switch (reportName) {
    /*
     * Employees
     */

    case 'employees-all': {
      sql = 'select * from MonTY.Employees'
      break
    }

    case 'employees-contacts': {
      sql = `select
        employeeNumber, employeeSurname, employeeGivenName,
        jobTitle, department,
        workContact1, workContact2, homeContact1, homeContact2
        from MonTY.Employees
        where isActive = 1
        and recordDelete_dateTime is null
        order by employeeSurname, employeeGivenName, employeeNumber`
      break
    }

    case 'employees-inactive': {
      sql = `select
        employeeNumber, employeeSurname, employeeGivenName,
        jobTitle, department
        from MonTY.Employees
        where isActive = 0
        and recordDelete_dateTime is null
        order by employeeSurname, employeeGivenName, employeeNumber`
      break
    }

    /*
     * Absence Records
     */

    case 'absenceRecords-all': {
      sql = 'select * from MonTY.AbsenceRecords'
      break
    }

    case 'absenceRecords-recent': {
      sql = absenceRecordsRecentSQL + ' order by r.absenceDateTime, r.recordId'

      request = request.input(
        'recentDays',
        configFunctions.getProperty('settings.recentDays')
      )

      break
    }

    case 'absenceRecords-recent-byEmployeeNumber': {
      sql =
        absenceRecordsRecentSQL +
        ` and r.employeeNumber = @employeeNumber
          order by r.absenceDateTime, r.recordId`

      request = request
        .input('recentDays', configFunctions.getProperty('settings.recentDays'))
        .input('employeeNumber', reportParameters.employeeNumber)

      break
    }

    case 'historicalAbsenceRecords-all': {
      sql = 'select * from MonTY.HistoricalAbsenceRecords'
      break
    }

    case 'absenceTypes-all': {
      sql = 'select * from MonTY.AbsenceTypes'
      break
    }

    case 'absenceTypes-active': {
      sql = `select absenceTypeKey, absenceType, orderNumber,
        recordUpdate_userName, recordUpdate_dateTime
        from MonTY.AbsenceTypes
        where recordDelete_dateTime is null
        order by orderNumber, absenceType`
      break
    }

    /*
     * Return to Work Records
     */

    case 'returnToWorkRecords-all': {
      sql = 'select * from MonTY.ReturnToWorkRecords'
      break
    }

    case 'returnToWorkRecords-recent': {
      sql =
        returnToWorkRecordsRecentSQL + ' order by r.returnDateTime, r.recordId'

      request = request.input(
        'recentDays',
        configFunctions.getProperty('settings.recentDays')
      )

      break
    }

    case 'returnToWorkRecords-recent-byEmployeeNumber': {
      sql =
        returnToWorkRecordsRecentSQL +
        ` and r.employeeNumber = @employeeNumber
          order by r.returnDateTime, r.recordId`

      request = request
        .input('recentDays', configFunctions.getProperty('settings.recentDays'))
        .input('employeeNumber', reportParameters.employeeNumber)

      break
    }

    case 'historicalReturnToWorkRecords-all': {
      sql = 'select * from MonTY.HistoricalReturnToWorkRecords'
      break
    }

    /*
     * Call Out List Members
     */

    case 'callOutListMembers-formatted': {
      sql = `select m.listId, l.listName,
        m.employeeNumber, e.employeeSurname, e.employeeGivenName,
        e.homeContact1, e.homeContact2, e.workContact1, e.workContact2,
        m.sortKey
        from MonTY.CallOutListMembers m
        left join MonTY.CallOutLists l on m.listId = l.listId
        left join MonTY.Employees e on m.employeeNumber = e.employeeNumber
        where m.recordDelete_datetime is null
        order by m.listId, m.sortKey, m.employeeNumber`

      break
    }

    case 'callOutListMembers-formatted-byListId': {
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

      break
    }

    /*
     * Call Out Records
     */

    case 'callOutRecords-all': {
      sql = 'select * from MonTY.CallOutRecords'
      break
    }

    case 'callOutRecords-recent': {
      sql = callOutRecordsRecentSQL + ' order by r.callOutDateTime, r.recordId'

      request = request.input(
        'recentDays',
        configFunctions.getProperty('settings.recentDays')
      )

      break
    }

    case 'callOutRecords-recent-byListId': {
      sql =
        callOutRecordsRecentSQL +
        ` and r.listId = @listId
          order by r.callOutDateTime, r.recordId`

      request = request
        .input('recentDays', configFunctions.getProperty('settings.recentDays'))
        .input('listId', reportParameters.listId)

      break
    }

    case 'callOutRecords-recent-byEmployeeNumber': {
      sql =
        callOutRecordsRecentSQL +
        ` and r.employeeNumber = @employeeNumber
          order by r.callOutDateTime, r.recordId`

      request = request
        .input('recentDays', configFunctions.getProperty('settings.recentDays'))
        .input('employeeNumber', reportParameters.employeeNumber)

      break
    }

    case 'historicalCallOutRecords-all': {
      sql = 'select * from MonTY.HistoricalCallOutRecords'
      break
    }

    case 'callOutResponseTypes-all': {
      sql = 'select * from MonTY.CallOutResponseTypes'
      break
    }

    case 'callOutResponseTypes-active': {
      sql = `select responseTypeId, responseType, isSuccessful, orderNumber,
        recordUpdate_userName, recordUpdate_dateTime
        from MonTY.CallOutResponseTypes
        where recordDelete_dateTime is null
        order by orderNumber, responseType`
      break
    }

    /*
     * After Hours Records
     */

    case 'afterHoursRecords-all': {
      sql = 'select * from MonTY.AfterHoursRecords'
      break
    }

    case 'afterHoursRecords-recent': {
      sql =
        afterHoursRecordsRecentSQL +
        ' order by r.attendanceDateTime, r.recordId'

      request = request.input(
        'recentDays',
        configFunctions.getProperty('settings.recentDays')
      )

      break
    }

    case 'afterHoursRecords-recent-byEmployeeNumber': {
      sql =
        afterHoursRecordsRecentSQL +
        ` and r.employeeNumber = @employeeNumber
          order by r.attendanceDateTime, r.recordId`

      request = request
        .input('recentDays', configFunctions.getProperty('settings.recentDays'))
        .input('employeeNumber', reportParameters.employeeNumber)

      break
    }

    case 'historicalAfterHoursRecords-all': {
      sql = 'select * from MonTY.HistoricalAfterHoursRecords'
      break
    }

    case 'afterHoursReasons-all': {
      sql = 'select * from MonTY.AfterHoursReasons'
      break
    }

    case 'afterHoursReasons-active': {
      sql = `select afterHoursReasonId, afterHoursReason, orderNumber,
        recordUpdate_userName, recordUpdate_dateTime
        from MonTY.AfterHoursReasons
        where recordDelete_dateTime is null
        order by orderNumber, afterHoursReason`
      break
    }

    /*
     * Default
     */

    default: {
      return undefined
    }
  }

  const result = await request.query(sql)

  return result.recordset
}

export default getReportData
